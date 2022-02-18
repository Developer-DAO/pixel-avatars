<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon, ExclamationIcon } from '@heroicons/vue/solid'
import { inject } from 'vue'
import Address from '../../components/ui/Address'
import MetaMask from '../../web3-providers/MetaMask'

const client = inject('web3client')
</script>

<template>
    <Menu
        v-if="!client.isConnected.value"
        as="div"
        class="relative inline-block text-left"
    >
        <div>
            <MenuButton
                class="
                    inline-flex
                    justify-center
                    w-full
                    rounded-md
                    border border-gray-300
                    shadow-sm
                    px-4
                    py-2
                    bg-black
                    text-white text-sm
                "
            >
                Connect wallet
                <ChevronDownIcon
                    class="-mr-1 ml-2 h-5 w-5"
                    aria-hidden="true"
                />
            </MenuButton>
        </div>

        <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <MenuItems
                class="
                    origin-top-right
                    absolute
                    right-0
                    mt-2
                    w-56
                    rounded-md
                    shadow-lg
                    bg-white
                    ring-1 ring-black ring-opacity-5
                    focus:outline-none
                "
            >
                <div class="py-1">
                    <MenuItem
                        v-slot="{ active }"
                        :disabled="!MetaMask.isAvailable()"
                    >
                        <button
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                'w-full flex items-center text-left px-4 py-2 text-sm disabled:opacity-70',
                            ]"
                            @click="
                                client.connect(
                                    client.supportedProviders.MetaMask
                                )
                            "
                        >
                            <img
                                src="/img/metamask.png"
                                class="w-6 h-6 mr-4"
                                alt="MetaMask Logo"
                            />
                            <span class="flex-1">MetaMask</span>
                            <ExclamationIcon
                                v-if="!MetaMask.isAvailable()"
                                class="w-4 h-4 text-gray-600"
                            />
                        </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                        <button
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                'w-full flex items-center text-left px-4 py-2 text-sm',
                            ]"
                            @click="
                                client.connect(
                                    client.supportedProviders.WalletConnect
                                )
                            "
                        >
                            <img
                                src="/img/walletconnect.png"
                                class="w-6 h-6 mr-4"
                                alt="Wallet Connect Logo"
                            />
                            <span>Wallet Connect</span>
                        </button>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>

    <div v-else class="flex-1 min-w-0 flex flex-col items-end space-y-1">
        <span class="text-sm text-gray-500">Connected to</span>
        <div>
            <Address
                v-model="client.connectedAddress.value"
                class="text-sm font-semibold truncate"
            />
        </div>
        <button
            class="text-sm inline text-blue-500"
            @click="client.disconnect()"
        >
            Disconnect
        </button>
    </div>
</template>
