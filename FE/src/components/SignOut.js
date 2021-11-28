import { Button, Spinner } from 'react-bootstrap';
import { useState } from 'react';
import { signout } from '../services/auth';
import Toaster from './Toaster';
import { Icons } from './icons';

const handleSignOut = async (resetUser, setStatus) => {
    setStatus('pending');
    const res = await signout();
    setStatus('done');
    if(res.status === 200){
        resetUser();
    }else{
        <Toaster variant="warning" message={res.message} action="Sign Out" callback={()=>{}}/>
    }
}

export default function SignOut({resetUser, user}) {
    const [status, setStatus] = useState("done");
    return(
        status === 'pending' ? (
            <Spinner variant="light" className="mx-2" animation="border" role="status">
                <span className="visually-hidden">Logging Out...</span>
            </Spinner> ) : (
                <Button variant="outline-light" className="shadow-none" onClick={async () => {await handleSignOut(resetUser, setStatus)}}>
                    <Icons.Exit className="me-2"/>Sign Out
                </Button>
            )
    );
}