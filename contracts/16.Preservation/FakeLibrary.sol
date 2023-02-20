// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract FakeLibrary {
    address public a;
    address public b;
    uint256 storedTime;

    function setTime(uint256 _time) public {
        storedTime = _time;
    }
}
