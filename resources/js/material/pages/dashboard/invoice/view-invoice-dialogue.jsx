import {
    Textarea,
    Button,
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter, Input, Alert,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import {useMaterialTailwindController} from "@/context";


export function ViewInvoiceDialogue({handleOpen,id}) {

    const [controller, dispatch] = useMaterialTailwindController();
    const { invoices } =
        controller;
    const invoice = invoices.find(item => item.invoice_id === id)
    const rawData = invoice.data
    const rawDataOnChain = invoice.dataOnChain
    const pay = ()=>{
        const link = rawDataOnChain ? JSON.parse(rawDataOnChain).invoiceLinks.pay : null;
        if(link)  window.open(link, '_blank', 'noreferrer');
    }

    return (
        invoice && <>
            <Dialog open={true} handler={handleOpen}>
                <DialogHeader>{'View'} Salary</DialogHeader>
                <DialogBody className="flex flex-col gap-4" divider>
                    <div className="flex gap-1">
                        <Input size="md" label="Invoice ID" readOnly defaultValue={invoice.invoice_id} />
                        <Input size="md" label="Request ID" readOnly defaultValue={invoice.request_id} />
                    </div>
                    <div className="flex gap-1">
                        <Input size="md" label="Creation Date"  defaultValue={new Date(invoice.creationDate).toDateString()} />
                        <Input size="md" label="Selected Currency" defaultValue={invoice.currency} />
                    </div>
                    <div className="flex gap-1">
                        <Input size="md" label="Employee Name" defaultValue={invoice.employee.name} />
                        <Input size="md" label="Employee Email" defaultValue={invoice.employee.email} />
                    </div>
                    <div className="flex gap-1">
                        <Input size="md" label="Payment Address" defaultValue={invoice.payment_address} />
                        <Input size="md" label="Payment Currency" defaultValue={invoice.payment_currency} />
                    </div>
                    {rawData && <Textarea label="rawData" defaultValue={rawData} />}
                    {rawDataOnChain && <Textarea label="rawDataOnChain" defaultValue={rawDataOnChain} />}

                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Close</span>
                    </Button>
                    <Button
                        variant="gradient" color="green"
                        onClick={pay}
                    >
                        <span>Pay</span>
                    </Button>

                </DialogFooter>
            </Dialog>
        </>
    );
}
ViewInvoiceDialogue.defaultProps = {
    handleOpen: ()=>{},
    id: String,

};

ViewInvoiceDialogue.propTypes = {
    handleOpen: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

export default ViewInvoiceDialogue;
