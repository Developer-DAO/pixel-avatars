# Pixel Avatar: Web server

The webserver is responsible for authorizing claims / mint requests from the web client.

- It verifies that the claiming address is owns the corresponding genesis token on the Ethereum blockchain.
- It creates a cryptographic signature that the Pixel Avatar can verify originates from this server.

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

##### GENESIS_RPC
A http://infura.io URL that points to either Ethereum mainnet or Rinkeby.

##### GENESIS_TOKEN
The address of the genesis contract.
- For testing, use Rinkeby address: `0x25ed58c027921E14D86380eA2646E3a1B5C55A8b`
- For production, use Mainnet address: `0x25ed58c027921E14D86380eA2646E3a1B5C55A8b`

##### PRIVATE_KEY
Generate a fresh keypair and fill with the provided private key. Please see "Creating a keypair".

### Creating a keypair
Whether for production or local development please always create a new keypair and never recycle keys across environments. 

**IMPORTANT: If a private key is exposed, a malicious user can bypass the server authorization and mint avatars they are not entitled to. Keep the private key safe at all times, and rotate for a fresh keypair if necessary.**

To generate a new keypair run: 

```bash 
node ./cli/generate-keys.js
```

- Set the private key in the `/web-server/.env` --> `PRIVATE_KEY`
- Set the address in the `/contract/.env` --> `SERVER_ADDRESS` before deployment. You may also update an existing contract by calling the `setServerAddress()` method as the contract owner.

### Local development

Start the webserver:

```shell
yarn serve # Starts a server on localhost:3000
```
