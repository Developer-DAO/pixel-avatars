# Full Local Developer Setup

These are the steps to get all the pieces running locally to:

- change the Solidity contract and deploy that
- run the web server
- run the local front-end

NOTE: If you want to just run the front-end (and rely on the deployed contract and server), visit `web_client/README.md`.

## Setup Steps

- Follow instructions in web-server/README.md (to setup back-end server and contract)
<!-- - Follow instructions in contract/README.md to get local hardhat network running -->
- Follow instructions in contract/README.md to get Mumbai contract running
  - change PixelAvatars.sol mintPrice to `0.01 ether` for testing at a cheaper price and set the serverAddress (the SERVER_ADDRESS from `contract/.env`) that was generated via `generate-keys.js`. e.g. `address public serverAddress = 0xAD0181Ef5e458E2EB3d7C6d7F743C27BD98624a1;`
  - Deploy to Mumbai instead via `yarn compile && yarn deploy:mumbai`
  - Visit https://mumbai.polygonscan.com and find contract address
  - Add contract address to `web-client/.env`
- Follow instructions in web-client/README.md to get front-end setup
- With hardhat network, back-end and front-end running, visit front-end at http://localhost:8080
- In MetaMask or Wallet Connect, add `localhost` network and choose it. Localhost network should have this rpc url (`http://localhost:8545`), chain (`31337`) and symbol (`MATIC`).
- You can now connect your wallet in UI.
- If you haven't minted your genesis NFT, create a test one or two by visiting https://rinkeby.etherscan.io/address/0x25ed58c027921E14D86380eA2646E3a1B5C55A8b and click on `Contract` section. Then click on `Write Contract`. Click `Connect to Web3`. Then find the `claim` method, add a tokenId between 1 and 8000, then click `Write`.
- Before you try to claim via UI, make sure you have a hardhat user setup in your wallet so you have MATIC to spend.
- Click on Claim
- View NFT via mumbai.polygonscan.com using contract address, followed by `?a=<token id>` e.g. https://mumbai.polygonscan.com/token/0xb5eab62881fc9845b2051c9eb2ac1ffbc213f434?a=6860#inventory
