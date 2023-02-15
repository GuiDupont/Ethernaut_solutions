# To try the solution:

1. Go on https://mumbaifaucet.com/ to get some mumbai matic.

2. Get a mumbai RPC URL, on Alchemy or Moralis for example.

3. Create .env file and complete it using env.example.

4. Update for each scripts you want to try the targetAddress variable by deplying the contract on https://ethernaut.openzeppelin.com/

5. Then you can run each attack individually using this command:
   npx hardhat run scripts/<attack path>

6. You can find an explanation of the attack method at the bottom of each script.

Note: The attack will only be executed in a local fork. You can add "--network mumbai" at the end of point 5 command.
