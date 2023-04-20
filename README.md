# To try the solutions:

1. Go to https://mumbaifaucet.com/ to get some mumbai matic.

2. Get a mumbai RPC URL, on Alchemy or Moralis for example.

3. Create .env file and complete it using env.example.

4. For each scripts you want to try, update the ```targetAddress``` variable by deploying the contract on https://ethernaut.openzeppelin.com/ and checking the browser console.

5. Then you can run each attack individually using this command:
   ```npx hardhat run scripts/<script path>```

6. You can find an explanation of the attack method at the bottom of each script.

7. It is possible that OpenZeppelin changes levels code source or solidity version. So be careful, my solutions might get outdated.

Note: The attack will only be executed in a local fork. You can run ```npx hardhat run scripts/<script path> --network mumbai``` to execute it on mumbai.
