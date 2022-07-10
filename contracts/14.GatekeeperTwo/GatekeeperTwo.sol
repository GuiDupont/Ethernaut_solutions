// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "hardhat/console.sol";

contract GatekeeperTwo {
  address public entrant;

  modifier gateOne() {
    console.log(msg.sender, tx.origin);
    require(msg.sender != tx.origin);
    console.log("all good");

    _;
  }

  modifier gateTwo() {
    uint256 x;

    assembly {
      x := extcodesize(caller())
    }
    console.log(x);
    require(x == 0);
    _;
  }

  modifier gateThree(bytes8 _gateKey) {
    console.log(uint64(0) - 1);
    require(
      uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^
        uint64(_gateKey) ==
        uint64(0) - 1
    );
    _;
  }

  function enter(bytes8 _gateKey)
    public
    gateOne
    gateTwo
    gateThree(_gateKey)
    returns (bool)
  {
    entrant = tx.origin;
    return true;
  }
}
