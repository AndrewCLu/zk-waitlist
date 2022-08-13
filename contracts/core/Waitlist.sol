pragma solidity 0.8.9;

import "../interfaces/IWaitlist.sol";
import "../interfaces/IVerifier.sol";

contract Waitlist is IWaitlist {
  // Max number of users allowed on the waitlist
  uint8 public maxWaitlistSpots;

  // Current number of users on waitlist
  uint8 public usedWaitlistSpots;

  // Mapping of users on the waitlist
  mapping(address => bool) internal waitlistedUsers;

  // List of public commitments from waitlisted users
  uint[] public commitments;

  // Whether or not the waitlist has been locked
  bool public isLocked;

  // Root of the Merkle tree
  uint public merkleRoot;

  // Mapping of nullifiers that have been used
  mapping(uint => bool) internal usedNullifiers;

  // Contract to verify waitlist locking proofs
  IVerifier public immutable lockerVerifier;
  
  // Contract to verify redemption proofs
  IVerifier public immutable redeemerVerifier;

  constructor(uint8 _maxWaitlistSpots, IVerifier _lockerVerifier, IVerifier _redeemerVerifier) {
    maxWaitlistSpots = _maxWaitlistSpots;
    lockerVerifier = _lockerVerifier;
    redeemerVerifier = _redeemerVerifier;
    usedWaitlistSpots = 0;
    isLocked = false;
  }

  function join(uint commitment) public returns (bool) {
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
      usedWaitlistSpots++;
      waitlistedUsers[msg.sender] = true;
      // TODO: Basic checks on commitment
      commitments.push(commitment);
      return true;
    }
  }

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
      if (commitments[i] != pubSignals[i]) {
        return false;
      }
    }

    // Verify the proof of Merkle root is correct
    if (!lockerVerifier.verifyProof(proof, pubSignals)) {
      return false;
    }

    isLocked = true;
    merkleRoot = pubSignals[numCommitments]; // Set Merkle root to be the output of the proof
    return true;
  }

  function redeem(
    bytes memory proof, 
    uint[] memory pubSignals
  ) public returns (bool) {
    return true;
  }
}
