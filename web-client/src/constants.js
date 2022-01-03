export const INFURA_ID = process.env.VUE_APP_INFURA_ID
export const OPEN_SEA_URL = process.env.VUE_APP_OPEN_SEA_URL
export const PIXEL_AVATAR_TOKEN = process.env.VUE_APP_PIXEL_AVATAR_TOKEN
export const PIXEL_AVATAR_NETWORK = {
    name: process.env.VUE_APP_PIXEL_AVATAR_NETWORK_NAME,
    chainId: parseInt(process.env.VUE_APP_PIXEL_AVATAR_NETWORK_CHAIN_ID ?? 0),
    ensAddress: process.env.VUE_APP_PIXEL_AVATAR_NETWORK_RPC,
    blockExplorer: process.env.VUE_APP_PIXEL_AVATAR_NETWORK_BLOCK_EXPLORER,
    currencySymbol: 'MATIC',
}

export const SERVER_URL = process.env.VUE_APP_SERVER_URL
export const TEST_MINT_GENESIS_URL = process.env.VUE_APP_TEST_MINT_GENESIS_URL
