import {Form} from 'react-bootstrap-formik';
import {Form as RBForm, Button, Spinner, Col, Card } from 'react-bootstrap';
import * as yup from 'yup';
import { createPost } from "../services/post";
import { useState } from 'react';
import Toaster from './Toaster';
import useWindowDimensions from './useWindowDimensions';
import ClockHistory from './icons/IconClockHistory';

// simple config returning allowed max length of subject and post body 
const config={
    maxLengthPost: 512,
    maxLengthSubject: 64,
}

const handleSignIn = async (values, helpers, setPosting, setError, setMessage, addPost) => {
    let {subject, post, expiry} = values;
    setPosting(true);
    const res = await createPost({subject, post, expiry});
    if(res.posted){
      helpers.resetForm();
      addPost(res.post);
      setMessage("Post created successfully. You can see it in Latest posts.")
    }else{
      setError(res.message);
    }
    setPosting(false);
  }

const NewPostValidation = yup.object().shape({
    subject: yup.string().max(config.maxLengthSubject).required(" "),
    post: yup.string().max(config.maxLengthPost).required(" "),
    expiry: yup.number().default(24),
  });

export default function NewPost({addPost}){
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const { width } = useWindowDimensions();
    
    // A form customised to fit each input field into each of the Card sub components thus concealing a regular html form appearance
    return(
        <Col xs={12}>
            <Card border="primary" className="m-2 mx-auto">
                <Form initialValues={{ subject: "", post: "", expiry: 24 }} validationSchema={NewPostValidation} 
                        validateOnBlur={false} onSubmit={(things, helpers) => handleSignIn(things, helpers, setPosting, setError, setMessage, addPost)}>
                    <Card.Header>
                        <RBForm.Group>
                            <Form.Input className="fw-bold no-outline p-0" name="subject" placeholder="Subject" autoComplete="off" maxLength={config.maxLengthSubject}/>
                        </RBForm.Group>
                    </Card.Header>
                    <Card.Body>
                        <RBForm.Group>
                            <Form.Textarea rows={2} className="no-outline p-0" name="post" placeholder="Share something with your college community..." maxLength={config.maxLengthPost}/>
                        </RBForm.Group>
                    </Card.Body>
                    <Card.Footer>
                    <div className="d-flex flex-wrap justify-content-md-between justify-content-xs-around">
                        <Col xs={8} sm={7} className="mx-auto">
                            <RBForm.Group className="input-group mx-auto">
                                <span className="input-group-text "><ClockHistory className="me-sm-2"/>{width < 576 ? '' : "Expires in"}</span>
                                <Form.Input className="shadow-none" name="expiry" type="number" min={1} max={24} required/>
                                <span className="input-group-text">Hrs</span>
                            </RBForm.Group>
                        </Col>
                        <Col xs={4} sm={5} className="mx-auto d-grid">
                            {posting ? <Spinner animation="grow" className="mx-auto"/> : <Button variant="primary" type="submit"> Post  </Button>}
                        </Col>
                    </div>
                    </Card.Footer>
                </Form>
            </Card>
            {error && (<Toaster variant="warning" message={error} action="Create Post" callback={()=>setError(null)}/>)} 
            {message && (<Toaster variant="success" message={message} action="Create Post" callback={()=>setMessage(null)}/>)} 
        </Col>
    );
}