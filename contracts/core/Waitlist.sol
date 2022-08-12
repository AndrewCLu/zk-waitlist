pragma solidity 0.8.9;

import "../interfaces/IWaitlist.sol";

contract Waitlist is IWaitlist {

  uint8 maxWaitlistSpots;
  address[] waitlistedUsers;
  uint[] merkleLeaves;
  uint[] usedNullifiers;

  constructor(uint8 _maxWaitlistSpots) {
    maxWaitlistSpots = _maxWaitlistSpots;
  }

  function join() public returns (bool) {
    return true;
  }

  function redeem(
    bytes memory proof, 
    uint[] memory pubSignals
  ) public returns (bool) {
    return true;
  }
}
