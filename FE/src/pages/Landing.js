import { Container } from 'react-bootstrap';
import AuthPanel from '../components/AuthPanel';

export default function Landing(props) {
    const {setUser, isAuth, setAuth} = props;
    return(
        <Container fluid="lg" className="my-auto">
            <div className="my-2 row">
                <div className="align-self-center m-auto col-12 col-md-9 col-lg-6 order-xs-2" style={{maxWidth: "600px"}}>
                    <h3 className="display-2">Campus Chats</h3>
                    <ul>
                        <li><h5>Join and share things with your college community</h5></li>
                        <li><h5>See what's going on in your campus online and offline</h5></li>
                    </ul>
                </div>
                {
                    !isAuth && (
                        <div className="align-self-center m-auto col-12 col-md-7 col-lg-5 order-xs-1" style={{maxWidth: "420px"}}>
                            <AuthPanel setUser={setUser} setAuth={setAuth}/>
                        </div>
                    )
                }
            </div>
        </Container>
    );
}