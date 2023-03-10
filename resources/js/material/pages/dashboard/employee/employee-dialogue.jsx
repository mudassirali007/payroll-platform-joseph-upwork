import {

    Button,
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter, Input, Alert,
} from "@material-tailwind/react";
import React, { useState, useEffect} from "react";
import axios from "axios";
import {useForm} from "@/hooks/useForm";
import PropTypes from "prop-types";
import ButtonLoader from "@/widgets/loader/button-loader";
import {setEmployees, useMaterialTailwindController} from "@/context";

export function EmployeeDialogue({handleOpen,employee}) {

    const [name, setName] = useState(employee?.name?employee.name:'');
    const [email, setEmail] = useState(employee?.email?employee.email:'');
    const [department, setDepartment] = useState(employee?.department?employee.department:'');
    const [jobTitle, setJobTitle] = useState(employee?.job_title?employee.job_title:'');
    const id = employee?.id;
    const { setErrors, renderFieldError,  message, setMessage } = useForm();
    const [controller, dispatch] = useMaterialTailwindController();
    const { employees } =
        controller;
    const [loaderVisible, setLoaderVisibility] = useState(false);

    const onSubmit = () => {
        setLoaderVisibility(true)
        if(id){
            axios.put(`/api/employee/${id}`, {
                name,
                department,
                job_title: jobTitle
            }).then(response => {
                console.log(response)
                if(response?.data?.employee) {
                    employees[employees.findIndex((obj => obj.id == id))] = response.data.employee
                    setEmployees(dispatch, employees || []);
                }
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
                handleOpen()
                setLoaderVisibility(false)
            });
        } else {
            axios.post('/api/employee', {
                name,
                email,
                department,
                job_title: jobTitle
            }).then(response => {
                console.log(response)
                if(response?.data?.employee) employees.push(response.data.employee)
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

        }
    };

    return (
        <>
            <Dialog open={true} handler={handleOpen}>
                <DialogHeader>{id?'Edit':'Add'} Employee</DialogHeader>
                <DialogBody className="flex flex-col gap-4" divider>
                    {
                        message && <Alert>{message}</Alert>
                    }
                    <Input label="Name" size="lg"  name="name" required autoComplete="name" autoFocus value={name} onChange={e => setName(e.target.value)}/>
                    <Input disabled={id} type="email" label="Email" size="lg"  name="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}/>
                    <Input label="Department" size="lg"  name="department" required autoComplete="department"  value={department} onChange={e => setDepartment(e.target.value)}/>
                    <Input label="Job Title" size="lg"  name="jobTitle" required autoComplete="jobTitle"  value={jobTitle} onChange={e => setJobTitle(e.target.value)}/>
                    { renderFieldError('name') }
                    { renderFieldError('email') }
                    { renderFieldError('department') }
                    { renderFieldError('job_title') }
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
                        <span>{id?'Edit':'Create'}</span>
                        {loaderVisible && <ButtonLoader />}

                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
EmployeeDialogue.defaultProps = {
    handleOpen: ()=>{},
    employee: [],
};

EmployeeDialogue.propTypes = {
    handleOpen: PropTypes.func.isRequired,
    employee: PropTypes.object.isRequired,
};

export default EmployeeDialogue;
