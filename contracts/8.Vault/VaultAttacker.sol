// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Vault.sol";

contract VaultAttacker {
  using SafeMath for uint256;
  Vault target = Vault(0x95d7B9960500BDe2229D85b896fB6E5bD8578cA2);

  // function attack() public {
  //   target.transfer(msg.sender, 22);
  // }
}

