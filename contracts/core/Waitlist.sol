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

  // Root of the merkle tree
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
    return true;
  }

  function redeem(
    bytes memory proof, 
    uint[] memory pubSignals
  ) public returns (bool) {
    return true;
  }
}
