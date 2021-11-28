import {Form} from 'react-bootstrap-formik';
import  {Form as RBForm, Button, Spinner} from 'react-bootstrap';
import * as yup from 'yup';
import { signin } from "../services/auth";
import { useState } from 'react';
import Toaster from './Toaster';

const handleSignIn = async (values, setSignIn, setUser, setAuth, setError) => {
  setSignIn(true);
  const res = await signin({email: values.signinemail, password: values.signinpassword});
  setSignIn(false);
  if(res.signedin){
    setUser(res.userInfo);
    setAuth(true);
  }else{
    setError(res.message);
  }
}

const SignInValidation = yup.object().shape({
  signinemail: yup.string().trim().lowercase().email("Invalid Email address").required("Email cannot be empty"),
  signinpassword: yup.string().required("Password cannot be empty"),
});

export default function SignIn({setUser, setAuth}){
    const [signingin, setSignIn] = useState(false);
    const [error, setError] = useState(null);
    return(
      <Form className="m-2" initialValues={{ signinemail: "", signinpassword: "" }} initialStatus="yet to sign in" validationSchema={SignInValidation} onSubmit={(things, helpers) => handleSignIn(things, setSignIn, setUser, setAuth, setError)}>
        <RBForm.Group className="mb-3">
            <RBForm.Label>Email address</RBForm.Label>
            <Form.Input className="mb-3" name="signinemail" placeholder="example@gmail.com"/>
        </RBForm.Group>
        <RBForm.Group className="mb-3">
            <RBForm.Label>Password</RBForm.Label>
            <Form.Input className="mb-3" name="signinpassword" type="password" placeholder="Enter password"/>
        </RBForm.Group>
        <div className="d-grid pt-2">
          {signingin ? <Spinner animation="grow" className="mx-auto"/> : <Button variant="primary" type="submit">  Sign In  </Button>}
        </div>
        {error && (<Toaster variant="warning" message={error} action="Sign In" callback={()=>setError(null)}/>)}
      </Form>
    );
}