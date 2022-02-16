# Pixel Avatar: Contract

This is the smart contract for the Developer DAO pixel avatar NFT.

![Solidity contract tests](https://github.com/Developer-DAO/pixel-avatars/actions/workflows/continuous-integration.yaml/badge.svg)

## Installation

### Install dependencies

```shell
yarn install
```

### Setup `.env`

```shell
cp .env.example .env
```

Fill in the environment variables suitable for your needs.

In order to deploy the contract to a given network you will need:

-   `SERVER_ADDRESS`: The address from the webserver keypair. See "Deployment" section for more information.
-   `{NETWORK}_RPC_URL`: An http://infura.io url. Sign up for http://infura.io to get one for the given network.
-   `{NETWORK}_PRIVATE_KEY`: The private key for the wallet that will become the owner of the deployed contract.

## Local development

**VSCode Setup**

If using VSCode, the OpenZeppelin imports are shown with red lint errors when using the Solidity VSCode plugin.

This project is a monorepo, so the contract is not in a standard location picked up by the plugin and it can't find the OpenZeppelin imports.

To fix, open Settings for the Solidity VSCode plugin and set "Package Default Dependencies Directory" to `contract/node_modules` instead of default `node_modules`.

**Run local tests**

For first time install, you need to also install dependencies for `web-server` since tests are depending on a `utils.js` module.

```shell
cd web-server
yarn
```

Ok, let's head back to `contract` folder then:

```shell
yarn test

yarn test:coverage      # to see coverage report
yarn test:report_gas    # to see report on estimated gas usage
```

**Start a local node**

```shell
yarn chain
```

Now you may deploy your contract locally.

## Deployment

### Compile contract

This will lint and style your code, as well as create artifacts consumed by the frontend.

```shell
yarn compile
```

Only necessary if changes were made to the codebase.

### Deploy contract

Deploy to a given network. Make sure that `.env` variables are set for the corresponding network.

---

**Important: Before deploying**

Please make sure that you have set the correct `SERVER_ADDRESS` in the `.env` file. The address should correspond to the associated webserver private key.

Each environment should have their separate keypair - this is important.

See `/web-server/README.md` for more information.

**As this is an OpenZeppelin Upgradeable Contract**, there are two types of deploys now:

-   an initial deploy (only do once to setup initial 3 contracts), and
-   an upgrade deploy on each subsequent release

**Localhost (hardhat)**

```shell
yarn compile && yarn deploy
```

or

```shell
# make sure UPGRADEABLE_PROXY_ADDRESS .env has a value that points to OpenZeppelin Proxy contract.
yarn compile && yarn run upgrade
```

**Polygon mainnet**

```shell
yarn compile && yarn deploy:mainnet
# IMPORTANT: Make sure you check-in the .JSON file in `.openzeppelin' which is needed for upgrades.
```

or

```shell
# make sure UPGRADEABLE_PROXY_ADDRESS .env has a value that points to OpenZeppelin Proxy contract.
yarn compile && yarn upgrade:mainnet
# IMPORTANT: Make sure you check-in the .JSON file in `.openzeppelin' which is needed for upgrades.
```

If you want to upload contract source. You can't call contract directly, except through Proxy -- see below for Hardhat code to try the contract.

-   Make sure `ETHERSCAN_API_KEY` .env key is set to API for polygonscan
-   Then to verify contract, run `npx hardhat verify --network mainnet CONTRACT_ADDRESS_HERE`.

**Mumbai testnet**

```shell
yarn compile && yarn deploy:mumbai
```

or

```shell
# make sure UPGRADEABLE_PROXY_ADDRESS .env has a value that points to OpenZeppelin Proxy contract.
yarn compile && yarn upgrade:mumbai
```

If you want to upload contract source. You can't call contract directly, except through Proxy -- see below for Hardhat code to try the contract.

-   Make sure `ETHERSCAN_API_KEY` .env key is set to API for polygonscan
-   Then to verify contract, run `npx hardhat verify --network mumbai CONTRACT_ADDRESS_HERE`.

## To play with contract via Proxy in Hardhat

    npx hardhat console --network mumbai

    > await ethers.provider.listAccounts();
    > const Avatars = await ethers.getContractFactory('PixelAvatars');
    > const avatars = await Avatars.attach('<proxy address goes here>');
    > await avatars.mintPrice();
    > await avatars.baseURI();
    > await avatars.serverAddress();
    > await avatars.setMintPrice('2000000000000000');
    > await avatars.ownerOf('6860');
