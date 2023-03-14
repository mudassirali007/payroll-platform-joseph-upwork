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

    return (
        invoice && <>
            <Dialog open={true} handler={handleOpen}>
                <DialogHeader>{'View'} Salary</DialogHeader>
                <DialogBody className="flex flex-col gap-4" divider>
                    <Input size="lg" label="Invoice ID" readOnly defaultValue={invoice.invoice_id} />
                    <Input size="lg" label="Creation Date"  defaultValue={new Date(invoice.creationDate).toDateString()} />
                    <Input size="lg" label="Selected Currency" defaultValue={invoice.currency} />
                    <Input size="lg" label="Employee Name" defaultValue={invoice.employee.name} />
                    <Input size="lg" label="Employee Email" defaultValue={invoice.employee.email} />
                    <Input size="lg" label="Payment Address" defaultValue={invoice.payment_address} />
                    <Input size="lg" label="Payment Currency" defaultValue={invoice.payment_currency} />
                    {rawData && <Textarea label="rawData" defaultValue={rawData} />}

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
