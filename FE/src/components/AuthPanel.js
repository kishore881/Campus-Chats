import { Tabs, Tab, Fade } from "react-bootstrap";
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function AuthPanel(props){
    const {setUser, setAuth} = props;
    return(
        <div className="rounded shadow p-3 my-4 mx-auto max-vw-100"  style={{backgroundColor: "#fff"}}>
            <Tabs defaultActiveKey="signin" id="auth-tab" transition={Fade} className="d-flex justify-content-center">
                <Tab eventKey="signin" title="Sign In">  <SignIn setAuth={setAuth} setUser={setUser}/>  </Tab>
                <Tab eventKey="signup" title="Sign Up">    <SignUp />  </Tab>
            </Tabs>
        </div>
    );
}