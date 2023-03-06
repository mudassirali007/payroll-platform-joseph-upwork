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
import EmployeeDialogue from "@/pages/dashboard/employee/employee-dialogue";
import {setEmployees, useMaterialTailwindController} from "@/context";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import {useForm} from "@/hooks/useForm";


export function Employee() {

    const [controller, dispatch] = useMaterialTailwindController();
    const { employees } =
        controller;
    const [open, setOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const { message, setMessage } = useForm();


    const fetchData = () => {
        axios.get('/api/employee').then(response => {
            if(response.status === 200) setEmployees(dispatch, response.data || []);
        }).catch(error => {
            console.error(error);

        });
    }

    useEffect(() => {
        // fetchData();
    },[])

    const handleOpen = () => setOpen(!open);
    const selectEmployee = (data) => setSelectedEmployee(data);

    const onDelete = ({id}) => {
        if(id){
            employees.splice(employees.findIndex((obj => obj.id == id)), 1)
            setEmployees(dispatch, employees || []);
            axios.delete(`/api/employee/${id}`).then(response => {
                console.log(response)
            }).catch(error => {
                console.error(error);
                if(error.response) {
                    if (error.response.data.message) {
                        setMessage(error.response.data.message);
                    }
                }
            }).finally(()=>{

            });
        }
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            {open && <EmployeeDialogue handleOpen={handleOpen} employee={selectedEmployee} />}
            <Card>
                <CardHeader variant="gradient" color="blue" className="flex items-center mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Employee Table
                    </Typography>
                    <Button className="ml-auto" variant="gradient" color="green" onClick={()=> {selectEmployee({}); handleOpen()}}>
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
                            {["name", "department", "job title", "action"].map((el) => (
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
                        {employees.map(
                            ({ id, name, email, job_title, department }, key) => {
                                const className = `py-3 px-5 ${
                                    key === employees.length - 1
                                        ? ""
                                        : "border-b border-blue-gray-50"
                                }`;

                                return (
                                    <tr key={key}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                {/*<Avatar src={img} alt={name} size="sm" />*/}
                                                <div>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        {name}
                                                    </Typography>
                                                    <Typography className="text-xs font-normal text-blue-gray-500">
                                                        {email}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {department?department:'N/A'}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {job_title?job_title:'N/A'}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="flex">
                                                <PencilSquareIcon className="mx-2 h-5 w-5 text-blue-gray-500" onClick={()=> {selectEmployee({ id, name, email, job_title, department }); handleOpen()}}/>
                                                <TrashIcon className="mx-2 h-5 w-5 text-blue-gray-500" onClick={()=> {onDelete({ id })}}/>
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

export default Employee;
