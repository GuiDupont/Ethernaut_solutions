// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;

contract LibraryContract {
    // stores a timestamp
    uint256 storedTime;

    function setTime(uint256 _time) public {
        storedTime = _time;
    }
}
