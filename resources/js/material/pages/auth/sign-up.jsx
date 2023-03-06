import {Link, useNavigate} from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import React, {useContext, useEffect, useState} from "react";
import {useForm} from "@/hooks/useForm";
import axios from "axios";
import {AuthContext} from "@/context";
import ButtonLoader from "@/widgets/loader/button-loader"

export function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loaderVisible, setLoaderVisibility] = useState(false);
    const { setErrors, renderFieldError } = useForm();
    const {authData} = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if(authData.signedIn) {
            navigate('/dashboard/home');
        }
    }, []);

    const makeRequest = (e) => {
        e.preventDefault();

        setErrors(null);
        setLoaderVisibility(true)
        axios.post('/api/register', {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation
        }).then(response => {


            if(response.data.user) {
                alert("Register success");

                navigate('/auth/sign-in');
            }
        }).catch(error => {
            console.error(error);

            if(error.response) {
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
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign Up
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input label="Name" size="lg"  name="name" required autoComplete="name" autoFocus value={name} onChange={e => setName(e.target.value)}/>
            <Input type="email" label="Email" size="lg"  name="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}/>
            <Input type="password" label="Password" size="lg" name="password" required autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)}/>
            <Input type="password" label="Confirm Password" size="lg" name="password_confirmation" required autoComplete="new-password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)}/>
              {renderFieldError('name')}
              {renderFieldError('email')}
              {renderFieldError('password')}
              {renderFieldError('password_confirmation')}
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth onClick={makeRequest} disabled={loaderVisible}>
              Sign Up
                {loaderVisible && <ButtonLoader />}
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Already have an account?
              <Link to="/auth/sign-in">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignUp;
