// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SimpleTrick.sol";

contract GatekeeperThree {
    address public owner; // slot 1
    address public entrant; // slot 2
    bool public allow_enterance = false; // slot3
    SimpleTrick public trick;

    function construct0r() public {
        owner = msg.sender;
    }

    modifier gateOne() {
        require(msg.sender == owner);
        require(tx.origin != owner);
        _;
    }

    modifier gateTwo() {
        require(allow_enterance == true);
        _;
    }

    modifier gateThree() {
        if (
            address(this).balance > 0.001 ether &&
            payable(owner).send(0.001 ether) == false
        ) {
            _;
        }
    }

    function getAllowance(uint _password) public {
        if (trick.checkPassword(_password)) {
            allow_enterance = true;
        }
    }

    function createTrick() public {
        trick = new SimpleTrick(payable(address(this)));
        trick.trickInit();
    }

    function enter() public gateOne gateTwo gateThree returns (bool entered) {
        entrant = tx.origin;
        return true;
    }

    receive() external payable {}
}
