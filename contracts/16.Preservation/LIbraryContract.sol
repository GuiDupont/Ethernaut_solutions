// Simple library contract to set the time
pragma solidity ^0.6.0;

contract LibraryContract {
  // stores a timestamp
  uint256 storedTime;

  function setTime(uint256 _time) public {
    storedTime = _time;
  }
}
