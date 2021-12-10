<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/solid'
import { inject } from 'vue'
import { SUPPORTED_PROVIDERS } from './useWeb3Provider'

const state = inject('walletState')
</script>

<template>
    <Menu
        v-if="!state.isConnected.value"
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
                    <MenuItem v-slot="{ active }">
                        <span class="flex">
                            <button
                                :class="[
                                    active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                    'w-full flex items-center text-left px-4 py-2 text-sm',
                                ]"
                                @click="
                                    state.connect(SUPPORTED_PROVIDERS.META_MASK)
                                "
                            >
                                <img src="/img/metamask.png" class="w-6 h-6 mr-4" alt="MetaMask Logo">
                                <span>MetaMask</span>
                            </button>
                        </span>
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
                                state.connect(
                                    SUPPORTED_PROVIDERS.WALLET_CONNECT
                                )
                            "
                        >
                            <img src="/img/walletconnect.png" class="w-6 h-6 mr-4" alt="Wallet Connect Logo">
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
            <span
                class="text-sm font-semibold truncate"
                v-text="state.address.value.substr(0, 20) + '...'"
            />
        </div>
        <button
            class="text-sm inline text-blue-500"
            @click="state.disconnect()"
        >
            Disconnect
        </button>
    </div>
</template>
