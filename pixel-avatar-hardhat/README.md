# Pixel avatar hardhat project

Create a .env file and populate the values for these variables. Or use Github env vars to load the values for these variables.

```
# ethereum wallet private key
export PRIVATE_KEY='abcde'
export ALCHEMY_RINKEBY_RPC_URL="https://eth-rinkeby.alchemyapi.io/v2/abcde"
# api key used to verify contract on etherscan
export ETHERSCAN_API_KEY="abcde" # leave this line as it is if you don't want to use etherscan verify at this time.
```

Load the env variables from .env file

    source .env

Install required node packages

    npm i

Deploy the contract to ethereum network

    npx hardhat run scripts/deploy.js --network rinkeby # or any other network

## To run local tests

    npm test

The default network in `hardhat.config.ts` is configured to use the in-process `hardhat` network.

Other handy commands:

    npm run test:coverage
    npm run test:report_gas
