import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import SignOut from './SignOut';
import { Icons } from './icons';

export default function NavBar({resetUser, isAuth, user}) {
    return(
        <Navbar collapseOnSelect expand="md" bg="primary" variant="dark">
            <Container fluid="lg">
                <Navbar.Brand>Campus Chats</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                {
                    isAuth && (
                        <Nav className="ms-auto">
                            <div className="d-flex flex-nowrap justify-content-around">
                                <NavLink to="/home" className="my-md-auto my-2">
                                    <Button variant="outline-light" className="shadow-none border-primary">
                                        <Icons.Home className="me-2"/>Home
                                    </Button>
                                </NavLink>
                                <NavLink to="/profile" className="mx-4 my-md-auto my-2">
                                    <Button variant="outline-light" className="shadow-none border-primary">
                                        <Icons.Profile className="me-2"/>Profile
                                    </Button>
                                </NavLink>
                            </div>
                            <SignOut resetUser={resetUser} user={user}/>
                        </Nav>
                    )
                }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}