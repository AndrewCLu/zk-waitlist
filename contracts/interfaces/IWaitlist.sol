// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

interface IWaitlist {
  function join(uint commitment) external;

  function lock(
    bytes memory proof, 
    uint[] memory pubSignals
  ) external;

  function redeem(
    bytes memory proof, 
    uint[] memory pubSignals
  ) external;
}