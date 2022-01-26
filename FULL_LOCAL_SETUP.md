# Full Local Developer Setup

These are the steps to get all the pieces of the application running locally to:

- make changes to the Solidity contract and deploy it to Mumbai Testnet
- change and run the web server
- change and run the local front-end

NOTE: If you want to only run the front-end (and rely on a deployed contract and server so you don't need to run locally), visit [./web-client/README.md](./web-client/README.md).

## Setup Steps

### Setup web server

Follow instructions in [./web-server/README.md](./web-server/README.md), specifically the `Creating a keypair` section, then the `Start the Webserver` section. (The earlier pieces are for running the web server against )

### Setup Contract on Polygon Mumbai Testnet

You can't run the contract locally with hardhat since it's Polygon and not Ethereum.

- Follow instructions in [./contract/README.md](./contract/README.md) to get Mumbai Testnet setup, namely setting `MUMBAI_RPC_URL` and `MUMBAI_PRIVATE_KEY` `.env` variables.
- Change contract:
  - change `PixelAvatars.sol` mintPrice to `0.01 ether` for testing at a cheaper price
  - set the `serverAddress` variables to the SERVER_ADDRESS from `contract/.env`, created in the `Generate a keypair` step)
  - Deploy to Mumbai via `yarn compile && yarn deploy:mumbai`. You'll see a value next to the `Token address` line.
  - Visit https://mumbai.polygonscan.com and find that token address. From there find the `contract` address.
  - Add `contract` address to `web-client/.env` for the `VUE_APP_PIXEL_AVATAR_TOKEN` variable.

### Run front-end

- Follow instructions in [./web-client/README.md](./web-client/README.md) to get front-end setup
- Change value for `VUE_APP_SERVER_URL` in `.env` to be `'http://127.0.0.1:3000'` to point to local server instead of staging server online.
- With contract, web server and front-end running, visit front-end at http://localhost:8080

### Setup your wallet for testing contract on Polygon Mumbai Testnet

- In MetaMask or Wallet Connect, add `Polygon Mumbai Testnet` network and choose it. Localhost network should have this RPC URL (from say http://infura.io), chain (`80001`) and symbol (`MATIC`).
- If you haven't minted your genesis NFT, create a test one or two by visiting https://rinkeby.etherscan.io/address/0x25ed58c027921E14D86380eA2646E3a1B5C55A8b and click on `Contract` section. Then click on `Write Contract`. Click `Connect to Web3`. Then find the `claim` method, add a tokenId between 1 and 8000, then click `Write`.

### Test the UI

- visit front-end at http://localhost:8080
- you can now connect your wallet in the UI
- before you try to claim via UI, make sure you have MATIC in your wallet to spend.
- Click on `Claim`
- View NFT via mumbai.polygonscan.com using `contract` address, followed by `?a=<token id>` e.g. https://mumbai.polygonscan.com/token/0xb5eab62881fc9845b2051c9eb2ac1ffbc213f434?a=6860#inventory
