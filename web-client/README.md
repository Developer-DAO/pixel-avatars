# Pixel Avatar: Web client

This is the VueJS frontend that previews and lets you mint the Developer DAO pixel avatar NFTs.

## Installation

### Install all dependencies

```shell
yarn install
```

### Setup `.env`
```shell
cp .env.example .env
```

Fill in the environment variables suitable for your needs. 

The example env comes pre-bottled with the Mumbai testnet contract and local webserver url for your convenience.

For a `INFURA_ID` please sign up and grab a free ID here: http://infura.io

### Local development

##### Start local development server

```shell
yarn serve # Starts a server on localhost:8080
```

To lint and prettify all files run:

```shell
yarn style
```

##### Use with local web server

For use with a locally deployed web server please replace the following `.env` variables: 

```dotenv
VUE_APP_SERVER_URL='http://127.0.0.1:3000'
```

Please refer to the `/web-server/README.md` for docs on how to start a local server instance.

##### Use with local pixel avatar contract

For use with a locally deployed hardhat contract please replace the following env variables:

```dotenv
VUE_APP_PIXEL_AVATAR_NETWORK_NAME='Hardhat'
VUE_APP_PIXEL_AVATAR_NETWORK_CHAIN_ID=31337
VUE_APP_PIXEL_AVATAR_NETWORK_RPC='http://127.0.0.1:8545'
VUE_APP_PIXEL_AVATAR_TOKEN=[CONTRACT ADDRESS PROVIDED BY HARDHAT]
```

### Production

```shell
yarn install
yarn build # Creates a dist folder
```
