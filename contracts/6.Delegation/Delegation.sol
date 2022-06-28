// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Delegate.sol";
import "hardhat/console.sol";

contract Delegation {
  address public owner;
  Delegate delegate;

  constructor(address _delegateAddress) public {
    delegate = Delegate(_delegateAddress);
    owner = msg.sender;
  }

  fallback() external {
    // console.log("before attack", owner);
    (bool result, ) = address(delegate).delegatecall(msg.data);
    // console.log("after attack", owner);
    if (result) {
      this;
    }
  // console.log(result);
  // result = !result;
  }
}

// Delegation
// Difficulty 4/10

// The goal of this level is for you to claim ownership of the instance you are given.

//   Things that might help

// Look into Solidity's documentation on the delegatecall low level function, how it works, how it can be used to delegate operations to on-chain libraries, and what implications it has on execution scope.
// Fallback methods
// Method ids
