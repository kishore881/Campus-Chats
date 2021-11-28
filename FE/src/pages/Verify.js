import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { verifyUser } from "../services/auth";

function getContent(status) {
    if(status === 'pending'){
        return(
            <>
            <Spinner animation="grow" size="lg" className="mx-3"/>
            <h5>Your Email Address is being confirmed...</h5>
            </>
        )
    }else if(status === 'verified'){
        return(
            <h5 className="mx-auto">Your Email Address is verified. You can now go to <Link to="/">Home Page</Link> and Sign In.</h5>
        )
    }else if(status === 'failed'){
        return(
            <h5 className="mx-auto">Your Email Address verification failed. Please try again.</h5>
        )
    }
}

/*
    this component is rendered when user clicks on the verification link in mail.
    On rendering the the verifyUser function from auth services is called and renders the response.
*/
export default function Verify(){
    const { userId } = useParams();
    const [status, setStatus] = useState('pending');
    useEffect(() => {
        verifyUser(userId).then(({verified, message}) => {
          if(!verified) setStatus('failed');
          else setStatus(message);
        }).catch(err => {
            setStatus('failed');
        });
      }, [userId]);
    return(
        <div className="text-center my-auto">
            {
                getContent(status)
            }
        </div>
    )
}