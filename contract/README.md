# Pixel Avatar: Contract

This is the smart contract for the Developer DAO pixel avatar NFT.

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
-   `{NETWORK}_RPC_URL`: An alchemy url. Sign up for http://alchemy.com to get one for the given network.
-   `{NETWORK}_PRIVATE_KEY`: The private key for the wallet that will become the owner of the deployed contract.

## Local development

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

**Localhost (hardhat)**

```shell
yarn deploy
```

**Polygon mainnet**

```shell
yarn deploy:mainnet
```

**Mumbai testnet**

```shell
yarn deploy:mumbai
```
