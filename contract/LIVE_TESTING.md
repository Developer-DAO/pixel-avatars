# How to test deployments on staging and production

## Testing Staging UI after first-time contract deploy

Ok, so in this scenario, you just deployed all 3 contracts for first time.

    $ yarn compile && yarn deploy:mumbai

And see:

```
Server address is: 0x0F8ecDDEB65Be72316cd444441A28BbB09f50581
Deploying contracts with the account: 0x3FD30529632b9f7a2ad013C643F08Eb055a09345
Account balance: 238599649983475713
OpenZeppelin Proxy deployed to: 0xF2AeA16553Ef83Ea4C7d9503DD647F902a792889

Please add the following line to your "contract/.env": UPGRADEABLE_PROXY_ADDRESS=0xF2AeA16553Ef83Ea4C7d9503DD647F902a792889
Please add the following line to your "web-client/.env": VUE_APP_PIXEL_AVATAR_TOKEN=0xF2AeA16553Ef83Ea4C7d9503DD647F902a792889
```

This means the Vercel VUE_APP_PIXEL_AVATAR_TOKEN needs to be updated for the web client so that it points to the new OpenZeppelin proxy contract, which in turn calls our Pixel Avatars contract.

In this example, contract deployed by `0x3FD30529632b9f7a2ad013C643F08Eb055a09345`.

Run through deploy. Make sure contracts exist:

    https://mumbai.polygonscan.com/address/0x3FD30529632b9f7a2ad013C643F08Eb055a09345

## Ran into server signature issue

Wait, my UI exploded with an "invalid server signature". We deployed contract with wrong SERVER_ADDRESS.

No problem, we can call the proxy via hardhat and fix it with:

```
$ npx hardhat console --network mumbai

> const Avatars = await ethers.getContractFactory('PixelAvatars');
> const avatars = await Avatars.attach('0xF2AeA16553Ef83Ea4C7d9503DD647F902a792889');
> await avatars.setServerAddress('0x0F8ecDDEB65Be72316cd444441A28BbB09f50581');
> await avatars.serverAddress();
```

## Back to testing, exercise the contract.

As you try minting in the UI, verify those transactions are being recorded on the Proxy contract:

    https://mumbai.polygonscan.com/address/0xF2AeA16553Ef83Ea4C7d9503DD647F902a792889

I've minted a few, how do I check the balance?

```
> await ethers.provider.getBalance('0xF2AeA16553Ef83Ea4C7d9503DD647F902a792889');
```

Exercise the ERC721 contract some more. See [README.md](./README.md) for a list of hardhat console commands to try!

Let's transfer all the Eth from contract back to owner `0x3FD30529632b9f7a2ad013C643F08Eb055a09345`

```
await avatars.withdraw();
```

## Let's try scenarios for transferring ownership

Ok, we have owners of all 3 contracts:

-   TransparentUpgradeableProxy -- this is our proxy that the web UI calls -- i.e. `0xF2AeA16553Ef83Ea4C7d9503DD647F902a792889`
-   PixelAvatars -- our contract -- i.e. `0x15656119515ab1fe9823f15d5329b92639cf13df`
-   ProxyAdmin -- This is an auxiliary contract meant to be assigned as the admin of a TransparentUpgradeableProxy. For an explanation of why you would want to use this see the documentation for TransparentUpgradeableProxy. More details: <https://docs.openzeppelin.com/contracts/3.x/api/proxy#TransparentUpgradeableProxy> i.e. `0x6ba89df52ef3d5d37c684dbdf81900835aecb74d`

### Scenario 1: Transfer Proxy to another Wallet (which can `withdraw`) and Ensure contract is still upgradeable

Ensure MUMBAI_PRIVATE_KEY in `hardhat.config.ts` points to original owners wallet.

'0x7128f5ff32eD07Ce12E6a9deBE32BB40F9884b3C' is the official DAO GnosisSafeProxy address.

```
$ npx hardhat console --network mumbai

> const Avatars = await ethers.getContractFactory('PixelAvatars');
> const avatars = await Avatars.attach('0xF2AeA16553Ef83Ea4C7d9503DD647F902a792889');
> await avatars.transferOwnership('0x53bB089cb6e7E556210857a5429B82Fe741fE551');
// > await avatars.transferOwnership('0x7128f5ff32eD07Ce12E6a9deBE32BB40F9884b3C');

# and now withdraw should fail for original owner:
> await avatars.withdraw();
```

Let's do the same for the ProxyAdmin `owner` so it matches.

-   Head to https://mumbai.polygonscan.com/address/0x6ba89Df52eF3d5D37C684dbDF81900835aeCB74D#writeContract
-   In Browser, connect to original owners wallet.
-   Call `transferOwnership` with `newOwner` field set to `0x53bB089cb6e7E556210857a5429B82Fe741fE551`.

With owner updated in both places, you should be able to upgrade contract as new owner.

**Can new owner upgrade contract ok?**

Now switch to new owner and try to upgrade contract.

Add a new method to `PixelAvatars.sol` to see if upgrade works:

```
    function something() public pure returns (string memory) {
        return "something";
    }
```

Try to upgrade:

    # make sure SERVER_ADDRESS is set correctly for environment (e.g. staging)
    # make sure UPGRADEABLE_PROXY_ADDRESS points at the TransparentUpgradeableProxy address
    yarn compile && yarn upgrade:mumbai
    # find newly upgraded contract by visiting ProxyAdmin and see what it set the contract to: https://mumbai.polygonscan.com/address/0x6ba89df52ef3d5d37c684dbdf81900835aecb74d
    npx hardhat verify --network mumbai PIXEL_AVATAR_CONTRACT_ADDRESS

    # if upgrade deployed ok, try calling that new method from Proxy via Hardhat console.
    > const Avatars = await ethers.getContractFactory('PixelAvatars');
    > const avatars = await Avatars.attach('0xF2AeA16553Ef83Ea4C7d9503DD647F902a792889');
    > await avatars.something();

    # check-in your `.openzeppelin` .JSON file changes

ok, now remove the test `something()` method and redeploy.

    yarn compile && yarn upgrade:mumbai

Interestingly removing code, the **tool was smart enough to point** to a previously deployed contract and didn't create a new one.

So if you won't find a new contract deployed, but if you visit `ProxyAdmin` logs (https://mumbai.polygonscan.com/address/0x6ba89df52ef3d5d37c684dbdf81900835aecb74d) and see what it has set the contract to a previously deployed one.

Lastly, after those upgrades, make sure the minting still works in the UI.