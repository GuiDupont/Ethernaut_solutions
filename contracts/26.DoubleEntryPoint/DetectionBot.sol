pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";


interface IDetectionBot {
    function handleTransaction(address user, bytes calldata msgData) external;
}

interface IForta {
    function setDetectionBot(address detectionBotAddress) external;
    function notify(address user, bytes calldata msgData) external;
    function raiseAlert(address user) external;
}

contract DetectionBot is IDetectionBot {

    function handleTransaction(address user, bytes memory msgData) override public {
        IForta(0x73a0B3ed12e4A620DA6Cbc1F19fDe5C029338FEf).raiseAlert(user);
    }
  }

