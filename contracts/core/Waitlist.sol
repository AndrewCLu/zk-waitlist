pragma solidity 0.8.9;

import "../interfaces/IWaitlist.sol";
import "../interfaces/IVerifier.sol";

contract Waitlist is IWaitlist {
  // Max number of users allowed on the waitlist
  uint public maxWaitlistSpots;

  // Mapping of users on the waitlist
  mapping(address => bool) internal waitlistedUsers;

  // List of commitments from waitlisted users
  uint[] public commitments;

  // Whether or not the waitlist has been locked
  bool public isLocked;

  // Root of the Merkle tree
  uint public merkleRoot;

  // Mapping of nullifiers that have been used
  mapping(uint => bool) internal usedNullifiers;

  // List of nullifiers that have been redeemed
  uint[] public nullifiers;

  // Contract to verify waitlist locking proofs
  IVerifier public immutable lockerVerifier;
  
  // Contract to verify redemption proofs
  IVerifier public immutable redeemerVerifier;

  event Join(
    address indexed joiner,
    uint indexed commitment
  );
  event Lock(
    address indexed locker
  );
  event Redeem(
    address indexed redeemer,
    uint indexed nullifier
  );

  constructor(uint _maxWaitlistSpots, address _lockerVerifierAddress, address _redeemerVerifierAddress) {
    maxWaitlistSpots = _maxWaitlistSpots;
    lockerVerifier = IVerifier(_lockerVerifierAddress);
    redeemerVerifier = IVerifier(_redeemerVerifierAddress);
    isLocked = false;
  }

  function getNumCommitments() public view returns(uint) {
    return commitments.length;
  }

  function getNumNullifiers() public view returns(uint) {
    return nullifiers.length;
  }

  // Joins the waitlist using a commitment provided by the user
  function join(uint commitment) public {
    uint usedWaitlistSpots = commitments.length;
    require(!isLocked, "Waitlist is locked.");
    require(!waitlistedUsers[msg.sender], "User has already signed up for waitlist.");
    require(usedWaitlistSpots < maxWaitlistSpots, "Waitlist is full.");
    for (uint i=0; i < usedWaitlistSpots; i++) {
      require(commitment != commitments[i], "Commitment has already been used.");
    }

    waitlistedUsers[msg.sender] = true;
    commitments.push(commitment);
    emit Join(msg.sender, commitment);
  }

  // Locks the waitlist using a proof of the Merkle root derived from all commitments
  // Locking disables the ability to claim new spots and enables redemptions
  function lock(
    bytes memory proof, 
    uint[] memory pubSignals
  ) public {
    uint numCommitments = commitments.length;
    require(!isLocked, "Waitlist is already locked.");
    // The current locker verifier circuit requires the number of commitments to be a power of 2
    require(numCommitments != 0 && (numCommitments & (numCommitments - 1)) == 0, "Waitlist must have a number of users equal to a nonzero power of 2 to be locked.");
    for (uint i=0; i<numCommitments; i++) {
      require(commitments[i] == pubSignals[i+1], "Wrong commitments used to generate locking proof.");
    }
    require(lockerVerifier.verifyProof(proof, pubSignals), "Locking proof is invalid.");

    isLocked = true;
    // Merkle root is returned as a public output of the proof
    merkleRoot = pubSignals[0]; 
    emit Lock(msg.sender);
  }

  // Redeems a spot on the waitlist given a valid proof of the secret used to generate a commitment
  function redeem(
    bytes memory proof, 
    uint[] memory pubSignals
  ) public {
    uint nullifier = pubSignals[0];
    uint proofMerkleRoot = pubSignals[1];
    require(isLocked, "Waitlist has not been locked.");
    require(!usedNullifiers[nullifier], "Nullifier has already been used.");
    require(proofMerkleRoot == merkleRoot, "Merkle root used in proof is incorrect.");
    require(redeemerVerifier.verifyProof(proof, pubSignals), "Redeeming proof is invalid.");

    usedNullifiers[nullifier] = true;
    nullifiers.push(nullifier);
    emit Redeem(msg.sender, nullifier);
  }
}
