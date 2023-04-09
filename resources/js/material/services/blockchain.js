import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import ledgerModule from '@web3-onboard/ledger'
import walletConnectModule from '@web3-onboard/walletconnect'

const dappId = 'd8feb4f6-076c-441a-ab9b-e23a70bcbab7'
const injected = injectedModule()
const coinbase = coinbaseWalletModule()
const ledger = ledgerModule()
const walletConnect = walletConnectModule({
    version: 2,
    handleUri: uri => console.log(uri),
    projectId: '92305bbe8b80e3805d2fb91bea585ca5'
})
const infuraKey = 'b4d8b2570b8440c6a6528ed5dd92d5f2'
// initialize Onboard
export const initWeb3Onboard = init({
    apiKey: dappId,
    connect: {
        autoConnectLastWallet: true
    },
    wallets: [
        injected,
        coinbase,
        ledger,
        walletConnect
    ],
    chains: [
        {
            id: '0x1',
            token: 'ETH',
            label: 'Ethereum Mainnet',
            rpcUrl: `https://mainnet.infura.io/v3/${infuraKey}`
        },
        {
            id: '0x5',
            token: 'ETH',
            label: 'Goerli',
            rpcUrl: `https://goerli.infura.io/v3/${infuraKey}`
        },
        {
            id: '0x13881',
            token: 'MATIC',
            label: 'Polygon - Mumbai',
            rpcUrl: 'https://matic-mumbai.chainstacklabs.com'
        },
        {
            id: '0x38',
            token: 'BNB',
            label: 'Binance',
            rpcUrl: 'https://bsc-dataseed.binance.org/'
        },
        {
            id: '0xA',
            token: 'OETH',
            label: 'Optimism',
            rpcUrl: 'https://mainnet.optimism.io'
        },
        {
            id: '0xA4B1',
            token: 'ARB-ETH',
            label: 'Arbitrum',
            rpcUrl: 'https://rpc.ankr.com/arbitrum'
        }
    ],
    appMetadata: {
        name: 'Connect Wallet Example',
        icon: '<svg>My App Icon</svg>',
        description: 'Example showcasing how to connect a wallet.',
        recommendedInjectedWallets: [
            { name: 'MetaMask', url: 'https://metamask.io' },
            { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
        ]
    },
    theme: 'dark'
})
