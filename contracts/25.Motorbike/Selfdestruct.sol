// SPDX-License-Identifier: MIT

pragma solidity 0.8.2; // changed solidity version for compatibility with OpenZeppelin

contract Selfdestruct {
    fallback() external {
        selfdestruct(payable(address(0)));
    }
}
