import {
    Select,
    Option,
    Button,
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter, Input, Alert,
} from "@material-tailwind/react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


import React, { useState, useEffect} from "react";
import axios from "axios";
import {useForm} from "@/hooks/useForm";
import PropTypes from "prop-types";
import ButtonLoader from "@/widgets/loader/button-loader";
import {setInvoices, useMaterialTailwindController} from "@/context";
import { currencyData } from "@/data";
import {initWeb3Onboard} from "@/services/blockchain";
import {useConnectWallet, useSetChain} from "@web3-onboard/react";
import {ethers} from "ethers";
import erc20abi from "@/smartContract/erc20ABI.json";


let provider
let erc20
export function InvoiceDialogue({handleOpen}) {

    const cryptoCurrency = currencyData.filter((item)=> item.network)

    const [currency, setCurrency] = useState(currencyData[0].id);
    const [unitPrice, setUnitPrice] = useState(0);
    const [paymentCurrency, setPaymentCurrency] = useState(cryptoCurrency[0].id);
    const [paymentAddress, setPaymentAddress] = useState('');
    const [employee, setEmployee] = useState(null);
    const { setErrors, renderFieldError,  message, setMessage } = useForm();
    const [controller, dispatch] = useMaterialTailwindController();
    const { invoices, employees } =
        controller;
    const [loaderVisible, setLoaderVisibility] = useState(false);

    const [inputCurrencyValue, setInputCurrencyValue] = useState('');
    const [inputPaymentCurrencyValue, setInputPaymentCurrencyValue] = useState('');
    const [inputEmpValue, setInputEmpValue] = useState('');

    const validation = () => {
        if(!employee || !employees.find((item)=>item.email === employee)){
            setMessage('Please Select Employee');
            return false
        }
        if(!currency || !currencyData.find(item => item.id === currency)){
            setMessage('Please Select Currency');
            return false
        }
        if(unitPrice <= 0){
            setMessage('Please Select Unit Price');
            return false
        }
        if(!paymentAddress){
            setMessage(`Please Select Employee's Wallet Address`);
            return false
        }
        if(!paymentCurrency || !cryptoCurrency.find(item => item.id === paymentCurrency)){
            setMessage(`Please Select Valid Payment Currency`);
            return false
        }
        return true
    }



    const onSubmit = () => {
        if(!validation()) return
        setLoaderVisibility(true)
        axios.post('/api/invoice', {
            employee_id: employees.find((item)=>item.email === employee).id,
            currency,
            unit_price: unitPrice,
            payment_address: paymentAddress,
            payment_currency: paymentCurrency,
        }).then(response => {
            console.log(response)
            if(response?.data?.invoice) invoices.push(response.data.invoice)
            handleOpen()
        }).catch(error => {
            console.error(error);
            if(error.response) {
                if (error.response.data.message) {
                    setMessage(error.response.data.message);
                }

                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                }
            }

        }).finally(()=>{

            setLoaderVisibility(false)
        });
    };

    const [web3Onboard, setWeb3Onboard] = useState(null)
    // default test transaction to Goerli
    const [toChain, setToChain] = useState('0x5')
    useEffect(() => {
        setWeb3Onboard(initWeb3Onboard)
    }, [])
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
    const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()

    // const [provider, setProvider] = useState(null)
    useEffect(() => {
        console.log(wallet,connectedChain)

    },[wallet])

    useEffect(() => {
        if (!wallet?.provider) {
            provider = null
            // setProvider(null)
        } else {
            provider = new ethers.providers.Web3Provider(wallet.provider, 'any')
            // provider = new ethers.BrowserProvider(wallet.provider, 'any')
            // setProvider(new ethers.BrowserProvider(wallet.provider, 'any'))

        }
    }, [wallet])
    const readyToTransact = async () => {
        if (!wallet) {
            handleOpen()
            const walletSelected = await connect()
            if (!walletSelected) return false
        }
        // prompt user to switch to Goerli for test
        // await setChain({ chainId: toChain })

        return true
    }
    const sendHash2 = async () => {
        if (!paymentAddress) {
            alert('An Ethereum address to send Eth to is required.')
            return
        }
        if (unitPrice <= 0) {
            alert('Enter Valid Amount.')
            return
        }
        try {

            const signer = await provider.getUncheckedSigner();
            const erc20 = new ethers.Contract(process.env.MIX_CONTRACT_ADDRESS_SEPOLIA, erc20abi, signer);

            const rc = await erc20.transferWithReferenceAndFee(paymentAddress,'0x84849086a9650229',ethers.utils.parseEther(`${unitPrice * 0.05}`),process.env.MIX_TARGET_ADDRESS_SEPOLIA, {value: ethers.utils.parseEther(`${unitPrice}`)});
            console.log(rc)
            if(rc.hash) setMessage(`https://sepolia.etherscan.io/tx/${rc.hash}`)
        } catch (e) {
            setMessage(e.message)
        }
    }
    const sendHash = async () => {
        if (!paymentAddress) {
            alert('An Ethereum address to send Eth to is required.')
            return
        }
        const signer = provider.getUncheckedSigner()
        // const signer = provider.getSigner()

        // To set gas using the Web3-Onboard Gas package(support Eth Mainnet and Polygon)
        // define desired confidence for transaction inclusion in block and set in transaction
        // const bnGasForTransaction = bnGasPrices.find(gas => gas.confidence === 90)

        const rc = await signer.sendTransaction({
            to: paymentAddress,
            value: 1000000000000000

            // This will set the transaction gas based on desired confidence
            // maxPriorityFeePerGas: gweiToWeiHex(
            //   bnGasForTransaction.maxPriorityFeePerGas
            // ),
            // maxFeePerGas: gweiToWeiHex(bnGasForTransaction.maxFeePerGas)
        })
        console.log(rc)
    }

    const sendTransaction = async () => {
        if (!paymentAddress) {
            alert('An Ethereum address to send Eth to is required.')
        }
        const balanceValue = Object.values(wallet.accounts[0].balance)[0]

        const signer = provider.getUncheckedSigner()

        const txDetails = {
            to: paymentAddress,
            value: 1000000000000000
        }

        const sendTransaction = () => {
            return signer.sendTransaction(txDetails).then(tx => tx.hash)
        }

        const gasPrice = () => provider.getGasPrice().then(res => res.toString())

        const estimateGas = () => {
            return provider.estimateGas(txDetails).then(res => res.toString())
        }
        console.log(estimateGas)

        // convert to hook when available
        const transactionHash =
            await web3Onboard.state.actions.preflightNotifications({
                sendTransaction,
                gasPrice,
                estimateGas,
                balance: balanceValue,
                txDetails: txDetails
            })
        console.log(transactionHash)
    }
    const onPay = async () => {
        const ready = await readyToTransact()
        if (!ready) return
        sendHash2()
    };

    return (
        <>
            <Dialog open={true} handler={handleOpen}>
                <DialogHeader>{'Create'} Salary</DialogHeader>
                <DialogBody className="flex flex-col gap-4" divider>
                    {
                        message && <Alert>{message}</Alert>
                    }
                    <Autocomplete
                        value={currency}
                        onChange={(event, newValue) => {
                            setCurrency(newValue);
                        }}
                        inputValue={inputCurrencyValue}
                        onInputChange={(event, newInputValue) => {
                            setInputCurrencyValue(newInputValue);
                        }}
                        disablePortal
                        id="currency"
                        options={currencyData.map((item) => item.id)}
                        renderInput={(params) => <TextField {...params} label="Select Currency" />}
                    />

                    <Input label="Amount" size="lg" type="number"  name="unit_price" required autoComplete="unit_price" autoFocus value={unitPrice} onChange={e => setUnitPrice(e.target.value)}/>
                    <Autocomplete
                        value={paymentCurrency}
                        onChange={(event, newValue) => {
                            setPaymentCurrency(newValue);
                        }}
                        inputValue={inputPaymentCurrencyValue}
                        onInputChange={(event, newInputValue) => {
                            setInputPaymentCurrencyValue(newInputValue);
                        }}
                        disablePortal
                        id="payment_currency"
                        options={cryptoCurrency.map((item) => item.id)}
                        renderInput={(params) => <TextField {...params} label="How do you want to pay?" />}
                    />
                    <Autocomplete
                        value={employee}
                        onChange={(event, newValue) => {
                            setEmployee(newValue);
                        }}
                        inputValue={inputEmpValue}
                        onInputChange={(event, newInputValue) => {
                            setInputEmpValue(newInputValue);
                        }}
                        disablePortal
                        id="employee"
                        options={employees.map((item) => item.email)}
                        renderInput={(params) => <TextField {...params} label="Employee's Information" />}
                    />
                    <Input label="Employee's Wallet address" size="lg"  name="payment_address" required autoComplete="payment_address"  value={paymentAddress} onChange={e => setPaymentAddress(e.target.value)}/>

                    { renderFieldError('employee_id') }
                    { renderFieldError('currency') }
                    { renderFieldError('unit_price') }
                    { renderFieldError('payment_address') }
                    { renderFieldError('payment_currency') }
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button disabled={loaderVisible} variant="gradient" color="green" onClick={()=>onSubmit()}  className="mr-1">
                        <span>{'Create'}</span>
                        {loaderVisible && <ButtonLoader />}
                    </Button>
                    <Button disabled={loaderVisible} variant="gradient" color="green"
                            onClick={()=>onPay()}
                    >
                        <span>{connecting ? 'Connecting' : !wallet ? 'Connect' : 'Pay'}</span>
                        {loaderVisible && <ButtonLoader />}
                    </Button>

                </DialogFooter>
            </Dialog>
        </>
    );
}
InvoiceDialogue.defaultProps = {
    handleOpen: ()=>{},
};

InvoiceDialogue.propTypes = {
    handleOpen: PropTypes.func.isRequired,
};

export default InvoiceDialogue;
