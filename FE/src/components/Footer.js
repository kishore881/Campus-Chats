import { Container } from "react-bootstrap"

export default function Footer(){
    return(
        <footer className="bg-primary text-white text-center py-2 my-0">
            <Container fluid="md" className="d-flex flex-wrap justify-content-around">
                <div className="my-2"> In case of any issues drop an email at <a href="mailto:campuschats.cc@gmail.com" target="_blank" rel="noreferrer">campuschats.cc@gmail.com</a></div>
                <div className="my-2"> -Developed by <a href="https://kancherlakishorereddy.github.io" target="_blank" rel="noreferrer"><strong>K.Kishorereddy</strong></a></div>
            </Container>
        </footer>
    );
}