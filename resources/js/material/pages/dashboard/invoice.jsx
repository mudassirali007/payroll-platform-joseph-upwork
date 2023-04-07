import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button, Alert,
} from "@material-tailwind/react";
import {
    TrashIcon
} from "@heroicons/react/24/solid";
import React, { useState, useEffect} from "react";
import axios from "axios";
import InvoiceDialogue from "@/pages/dashboard/invoice/invoice-dialogue";
import ViewInvoiceDialogue from "@/pages/dashboard/invoice/view-invoice-dialogue";
import {setInvoices, useMaterialTailwindController} from "@/context";
import ArrowTopRightOnSquareIcon from "@heroicons/react/24/solid/ArrowTopRightOnSquareIcon";
import {useForm} from "@/hooks/useForm";
import { init, useConnectWallet, useSetChain } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'
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
init({
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

export function Invoice() {

    const [controller, dispatch] = useMaterialTailwindController();
    const { invoices } =
        controller;
    const [open, setOpen] = useState(false);
    const [view, setView] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const { message, setMessage } = useForm();


    const fetchData = () => {
        axios.get('/api/invoice').then(response => {
            if(response.status === 200) setInvoices(dispatch, response.data || []);
        }).catch(error => {
            console.error(error);

        });
    }

    useEffect(() => {
        if(!invoices.length) fetchData();
    },[])

    const handleOpen = () => setOpen(!open);

    const handleView = () => setView(!view);
    const selectInvoice = (invoice_id) => setSelectedInvoice(invoice_id);


    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
    const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
    let provider
    useEffect(() => {
        console.log(wallet,connectedChain)
       
    },[wallet])

    let ethersProvider

    if (wallet) {
        // if using ethers v6 this is:
        ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
        // ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
    }

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <div>
                <button disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())}>
                    {connecting ? 'connecting' : wallet ? 'disconnect' : 'connect'}
                </button>
            </div>
            {open && <InvoiceDialogue handleOpen={handleOpen} />}
            {view && <ViewInvoiceDialogue handleOpen={handleView} id={selectedInvoice} />}
            <Card>
                <CardHeader variant="gradient" color="blue" className="flex items-center mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Salary Table
                    </Typography>
                    <Button className="ml-auto" variant="gradient" color="green" onClick={()=> {handleOpen()}}>
                        Create
                    </Button>

                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">

                    {
                        message && <Alert>{message}</Alert>
                    }
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                        <tr>
                            {["invoice id", "employee info", "unit price", "payment currency", "payment address", "action"].map((el) => (
                                <th
                                    key={el}
                                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                >
                                    <Typography
                                        variant="small"
                                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                                    >
                                        {el}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {invoices.map(
                            ({ invoice_id, employee, unit_price, payment_currency, payment_address }, key) => {
                                const className = `py-3 px-5 ${
                                    key === invoices.length - 1
                                        ? ""
                                        : "border-b border-blue-gray-50"
                                }`;

                                return (
                                    <tr key={key}>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {invoice_id?invoice_id:'N/A'}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                {/*<Avatar src={img} alt={name} size="sm" />*/}
                                                <div>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        {employee.name}
                                                    </Typography>
                                                    <Typography className="text-xs font-normal text-blue-gray-500">
                                                        {employee.email}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {unit_price?unit_price:'N/A'}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {payment_currency?payment_currency:'N/A'}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {payment_address?payment_address:'N/A'}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="flex">
                                                <ArrowTopRightOnSquareIcon className="mx-2 h-5 w-5 text-blue-gray-500" onClick={()=> {selectInvoice(invoice_id); handleView()}}/>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>

        </div>
    );
}

export default Invoice;
