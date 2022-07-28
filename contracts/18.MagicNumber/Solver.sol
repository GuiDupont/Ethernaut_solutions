pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Solver {
  function whatIsTheMeaningOfLife() public pure returns (uint256) {
    assembly {
      mstore8(0xff, 42)
      return(0xe0, 256)
    }
  }
}
