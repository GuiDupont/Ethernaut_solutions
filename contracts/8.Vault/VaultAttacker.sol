// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Vault.sol";

contract VaultAttacker {
    Vault target = Vault(0x95d7B9960500BDe2229D85b896fB6E5bD8578cA2);

    // function attack() public {
    //   target.transfer(msg.sender, 22);
    // }
}
