import {Form} from 'react-bootstrap-formik';
import  {Form as RBForm, Button, Spinner} from 'react-bootstrap';
import * as yup from 'yup';
import { signup } from "../services/auth";
import { useState } from 'react';
import Toaster from './Toaster';

const handleSignUp = async (values, helpers, setSignUp, setError, setMessage) => {
  setSignUp(true);
  const res = await signup({email: values.signupemail, password: values.signuppassword});
  setSignUp(false);
  if(res.signedup){
    setMessage(res.message);
    helpers.resetForm();
  }else{
    setError(res.message);
  }
}

const SignUpValidation = yup.object().shape({
  signupemail: yup.string().trim().lowercase().email("Invalid Email address").required("Email cannot be empty"),
  signuppassword: yup.string().min(8, "Password must have atleast 8 characters").required("Password cannot be empty"),
});


export default function SignUp(){
  const [signingup, setSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
    return(
      <Form className="m-2" initialValues={{ signupemail: "", signuppassword: "" }} validationSchema={SignUpValidation} onSubmit={(things, helpers) => handleSignUp(things, helpers, setSignUp, setError, setMessage)}>
        <RBForm.Group className="mb-3">
            <RBForm.Label>Email address</RBForm.Label>
            <Form.Input className="mb-3" name="signupemail" placeholder="example@gmail.com"/>
        </RBForm.Group>
        <RBForm.Group className="mb-3">
            <RBForm.Label>Password</RBForm.Label>
            <Form.Input className="mb-3" name="signuppassword" type="password" placeholder="Enter password"/>
        </RBForm.Group>
        <div className="d-grid pt-2">
          {signingup ? <Spinner animation="grow" className="mx-auto"/> : <Button variant="primary" type="submit">  Sign Up  </Button>}
        </div>
        {error && (<Toaster variant="danger" message={error} action="Sign Up" callback={() => {setError(null);}}/>)}
        {message && (<Toaster variant="success" message={message} action="Sign Up" callback={() => {setMessage(null);}}/>)}
      </Form>
    );
}