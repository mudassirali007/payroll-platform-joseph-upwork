import {
    Card,
    CardBody,
    Avatar,
    Typography,
    CardFooter,
     Input, Button,
} from "@material-tailwind/react";

import { ProfileInfoCard } from "@/widgets/cards";
import {useContext, useState} from "react";
import {AuthContext} from "@/context";
import axios from "axios";
import {useForm} from "@/hooks/useForm";
import {useAuth} from "@/hooks/useAuth";

export function Profile() {
    const [name, setName] = useState('');

    const {authData} = useContext(AuthContext);
    const { setErrors, renderFieldError } = useForm();
    const {updateLoggedUser} = useAuth();


    const makeRequest = (e) => {
        e.preventDefault();

        setErrors(null);

        axios.put('/api/updateUser', {
            name
        }).then(response => {
            if(response.data.user) {
                alert("Name Updated");
                updateLoggedUser(response.data.user)
            }
        }).catch(error => {
            console.error(error);

            if(error.response) {
                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                }
            }
        });
    };
  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt="bruce-mars"
                size="xl"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                    {authData.user.name}
                </Typography>

              </div>
            </div>

          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">

            <ProfileInfoCard
              title="Profile Information"
              details={{
                "Name": `${authData.user.name}`,
                email: `${authData.user.email}`,

              }}

            />
            <div>
                <CardBody className="flex flex-col gap-4">
                    <Input label="Name" size="lg"  name="name" required autoComplete="name" autoFocus value={name} onChange={e => setName(e.target.value)}/>
                    {renderFieldError('name')}

                </CardBody>
                <CardFooter className="pt-0">
                    <Button variant="gradient" fullWidth onClick={makeRequest}>
                        Update Name
                    </Button>
                </CardFooter>

            </div>
          </div>

        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
