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
        fetchData();
    },[])

    const handleOpen = () => setOpen(!open);

    const handleView = () => setView(!view);
    const selectInvoice = (invoice_id) => setSelectedInvoice(invoice_id);


    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            {open && <InvoiceDialogue handleOpen={handleOpen} />}
            {view && <ViewInvoiceDialogue handleOpen={handleView} id={selectedInvoice} />}
            <Card>
                <CardHeader variant="gradient" color="blue" className="flex items-center mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Invoice Table
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
