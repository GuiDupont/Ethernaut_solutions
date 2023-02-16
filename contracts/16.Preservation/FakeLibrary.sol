// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

import "hardhat/console.sol";

pragma solidity ^0.6.0;

contract FakeLibrary {
    // stores a timestamp
    address public a;
    address public b;
    uint256 storedTime;

    function setTime(uint256 _time) public {
        storedTime = _time;
    }
}
