pragma solidity 0.8.9;

interface IWaitlist {
  function join(uint commitment) external;

  function redeem(
    bytes memory proof, 
    uint[] memory pubSignals
  ) external returns (bool);
}