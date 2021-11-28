import { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

function isDark(variant) {
  if(variant === 'dark' || variant === 'primary') return true;
  return false;
}

export default function Toaster({variant, message, action, callback}){
  const [show, setShow] = useState(true);

  return(
    <ToastContainer className="px-2 py-5 my-5" position={'top-end'} style={{zIndex: 1}}>
    <Toast className="d-inline-block m-1" bg={variant} onClose={() => {setShow(false);callback();}} show={show} delay={5000} autohide>
      <Toast.Header>
        <strong className="me-auto text-dark">Campus Chats | {action}</strong>
      </Toast.Header>
      <Toast.Body className={isDark(variant) && 'text-white'}>
        <strong>{message}</strong>
      </Toast.Body>
    </Toast>
    </ToastContainer>
  );
}