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

---

As this is an OpenZeppelin Upgradeable Contract, there are two types of deploys now:

-   an initial deploy, and
-   an upgrade deploy on each subsequent release

**Localhost (hardhat)**

```shell
yarn deploy
```

or

```shell
# make sure UPGRADEABLE_PROXY_CONTRACT_ADDRESS .env has a value
yarn upgrade
```

**Polygon mainnet**

```shell
yarn deploy:mainnet
```

or

```shell
# make sure UPGRADEABLE_PROXY_CONTRACT_ADDRESS .env has a value
yarn upgrade:mainnet
```

**Mumbai testnet**

```shell
yarn deploy:mumbai
```

or

```shell
# make sure UPGRADEABLE_PROXY_CONTRACT_ADDRESS .env has a value
yarn upgrade:mumbai
```
