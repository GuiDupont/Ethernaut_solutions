// Simple library contract to set the time
pragma solidity ^0.6.0;

import "hardhat/console.sol";

pragma solidity ^0.6.0;

contract FakeLibrary {
  // stores a timestamp
  address public timeZone2Library;
  address public owner;
  uint256 storedTime;

  function setTime(uint256 _time) public {
    storedTime = _time;
  }
}
