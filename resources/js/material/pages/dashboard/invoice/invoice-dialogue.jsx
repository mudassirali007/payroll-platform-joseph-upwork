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

    return (
        <>
            <Dialog open={true} handler={handleOpen}>
                <DialogHeader>{'Create'} Invoice</DialogHeader>
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

                    <Input label="Amount" size="lg"  name="unit_price" required autoComplete="unit_price" autoFocus value={unitPrice} onChange={e => setUnitPrice(e.target.value)}/>
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
                    <Button disabled={loaderVisible} variant="gradient" color="green" onClick={()=>onSubmit()}>
                        <span>{'Create'}</span>
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
