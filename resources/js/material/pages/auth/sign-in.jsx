import {Link, useNavigate} from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    Checkbox,
    Button,
    Typography, Alert,
} from "@material-tailwind/react";
import {useAuth} from "@/hooks/useAuth";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/context";
import {useForm} from "@/hooks/useForm";
import axios from "axios";
import ButtonLoader from "@/widgets/loader/button-loader";

export function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const {setAsLogged} = useAuth();

    const {authData} = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        if(authData.signedIn) {
            navigate('/dashboard/home');
        }
    }, [authData]);

    const { setErrors, renderFieldError,  message, setMessage } = useForm();
    const [loaderVisible, setLoaderVisibility] = useState(false);

    const makeRequest = (e) => {
        e.preventDefault();

        setErrors(null);

        setMessage('');
        setLoaderVisibility(true)
        // make request first to sanctum/csrf-cookie
        axios.get('/sanctum/csrf-cookie').then(() => {


            const payload = {
                email,
                password
            };

            if(remember) {
                payload.remember = true;
            }

            axios.post('/api/login', payload, {
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {

                if(response.data.user) {

                    setAsLogged(response.data.user);
                }
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
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
              {
                  message && <Alert>{message}</Alert>
              }
            <Input type="email" label="Email" name="email"
                   required autoComplete="email" autoFocus size="lg" value={email} onChange={e => setEmail(e.target.value)} />
            <Input type="password" label="Password" size="lg" name="password"
                   required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)}/>
            <div className="-ml-2.5">
              <Checkbox label="Remember Me" name="remember" onChange={e => setRemember(e.target.checked ? true : false) }/>
            </div>
              { renderFieldError('password') }
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth onClick={makeRequest} disabled={loaderVisible}>
              Sign In
                {loaderVisible && <ButtonLoader />}
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Don't have an account?
              <Link to="/auth/sign-up">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignIn;
