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
    uint waitlistNumber, // Joiner's number on the waitlist
    uint commitment
  );
  event Lock(
    address locker,
    uint numWaitlistedUsers, 
    uint merkleRoot
  );
  event Redeem(
    address indexed redeemer,
    uint nullifier
  );

  constructor(uint _maxWaitlistSpots, address _lockerVerifierAddress, address _redeemerVerifierAddress) {
    maxWaitlistSpots = _maxWaitlistSpots;
    lockerVerifier = IVerifier(_lockerVerifierAddress);
    redeemerVerifier = IVerifier(_redeemerVerifierAddress);
    isLocked = false;
    // TODO: Can we ensure that the verifier contracts are the correct ones with the right parameters (merkle tree depth, etc.)?
  }

  // Attempts to join a waitlist for the current user using a commitment that can later be opened
  function join(uint commitment) public returns (bool) {
    uint usedWaitlistSpots = commitments.length;
    // Waitlist is locked
    if (isLocked) {
      return false;
    // User is already on waitlist
    } else if (waitlistedUsers[msg.sender]) {
      return false;
    // Waitlist is full
    } else if (usedWaitlistSpots >= maxWaitlistSpots) {
      return false;
    } else {
      // Commitment has already been used, user must choose a new secret
      for (uint i=0; i < commitments.length; i++) {
        if (commitment == commitments[i]) {
          return false;
        }
      }

      // Passed all checks, adding user to waitlist
      waitlistedUsers[msg.sender] = true;
      commitments.push(commitment);
      emit Join(msg.sender, usedWaitlistSpots + 1, commitment);
      return true;
    }
  }

  // Locks the waitlist so that no more users can join
  function lock(
    bytes memory proof, 
    uint[] memory pubSignals
  ) public returns (bool) {
    // Waitlist is already locked
    if (isLocked) {
      return false;
    } 

    uint numCommitments = commitments.length;
    // There are either no commitments or the number of commitments is not a power of 2
    // Note: The current locker verifier circuit requires the number of commitments to be a power of 2
    // TODO: Remove this constraint, possibly by adding extra Merkle leaves
    if (numCommitments == 0 || (numCommitments & (numCommitments - 1)) != 0) {
      return false;
    }

    // Check that the public inputs used for the locker prover, 
    // i.e. the claimed commitments, are equal to the actual commitments
    for (uint i=0; i<numCommitments; i++) {
      if (commitments[i] != pubSignals[i+1]) {
        return false;
      }
    }

    // Verify proof of Merkle root is correct
    if (!lockerVerifier.verifyProof(proof, pubSignals)) {
      return false;
    }

    // Passed all checks, locking contract
    isLocked = true;
    merkleRoot = pubSignals[0]; // Set Merkle root to be the output of the proof, located at pubSignals[0]
    emit Lock(msg.sender, numCommitments, merkleRoot);
    return true;
  }

  // Redeems a spot on the waitlist if a valid proof is provided of the secret used to generate a commitment
  function redeem(
    bytes memory proof, 
    uint[] memory pubSignals
  ) public returns (bool) {
    // Waitlist has not been locked yet
    if (!isLocked) {
      return false;
    }

    uint nullifier = pubSignals[0];
    uint proofMerkleRoot = pubSignals[1];

    // Nullifier has already been used
    if (usedNullifiers[nullifier]) {
      return false; 
    }

    // Check claimed Merkle root is equal to the current one
    if (proofMerkleRoot != merkleRoot) {
      return false;
    }

    // Verify proof of nullifier and Merkle root is correct
    if (!redeemerVerifier.verifyProof(proof, pubSignals)) {
      return false;
    }

    // Passed all checks, redeeming spot on waitlist
    usedNullifiers[nullifier] = true;
    nullifiers.push(nullifier);
    emit Redeem(msg.sender, nullifier);
    return true;
  }
}
