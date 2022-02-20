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

Our contract is **upgradeable**. This means that there are now three contracts -- and the proxy holds the data while the deployed contract holds the code. This way you can upgrade the contract without losing your data. There are some changes, for example you replace constructors with inializers.

I'd suggest you read OpenZeppelin's Upgrades Plugin [How Plugins Work](https://docs.openzeppelin.com/upgrades-plugins/1.x/#how-plugins-work) to get more familiar. I also found this forum post helpful: <https://forum.openzeppelin.com/t/openzeppelin-upgrades-step-by-step-tutorial-for-hardhat/3580>.

Also **Upgradeable Contract** means there are two types of deploys:

-   an initial deploy (only do once to setup initial 3 contracts), and
-   an upgrade deploy on each subsequent release

**!!**
**IMPORTANT: BEFORE AND AFTER DEPLOYING**
**!!**

1. If doing a deploy for the first time, you may want to remove the corresponding JSON file in `.openzeppelin` if you want 3 fresh contracts. Otherwise it'll reuse the ProxyAdmin already deployed (which might actually be fine, just FYI).

2. Before deploy or upgrade, please make sure that you have set the correct `SERVER_ADDRESS` in the `.env` file. The address should correspond to the associated webserver private key. Each environment should have their separate keypair - this is important. See `/web-server/README.md` for more information.

3. After deploy or upgrade, make sure you check-in the JSON file in `.openzeppelin` so that the contract can be upgraded next time.

4. To verify deployment visit https://polygonscan.com/ (or https://mumbai.polygonscan.com/ for Mumbai) and search for the account that deployed the contract. There should be 3 contracts upon initial deploy and then only 1 each time contract is upgraded.

### Compile contract

This will lint and style your code, as well as create artifacts consumed by the frontend.

```shell
yarn compile
```

Only necessary if changes were made to the codebase.

### Deploy contract

Deploy to a given network. Make sure that `.env` variables are set for the corresponding network.

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

    Some methods to try:

    > await avatars.mintPrice();
    > await avatars.baseURI();
    > await avatars.serverAddress();
    > await avatars.setServerAddress('0x1111...');
    > await avatars.setMintPrice('2000000000000000');

    > await avatars.ownerOf('6860');
    > await avatars.balanceOf('my public key here');
    > await avatars.totalSupply();

    > const contractBalance = await ethers.provider.getBalance("<proxy address goes here>")
