import { Container } from "react-bootstrap"

export default function Footer(){
    return(
        <footer className="bg-primary text-white text-center py-2 my-0">
            <Container fluid="md" className="d-flex flex-wrap justify-content-around">
                <div className="my-2"> In case of any issues drop an email at <a href="mailto:campuschats@outlook.com" target="_blank" rel="noreferrer">campuschats@outlook.com</a></div>
                <div className="my-2"> - View on <a href="https://github.com/kishore881/Campus-Chats" target="_blank" rel="noreferrer"><strong>GitHub</strong></a></div>
            </Container>
        </footer>
    );
}