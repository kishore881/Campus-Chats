import { useState } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap"
import useWindowDimensions from './useWindowDimensions';
import { getExpiry, getPostedAgo } from "../utils/post";
import { Icons } from "./icons"

export default function PostwithActions({post, removePost}){
    const [isDeleting, setDeleting] = useState(false);
    const postedAgo = getPostedAgo(post);
    const expiry = getExpiry(post);
    const { width } = useWindowDimensions();

    const handleDelete = async () => {
        let res = window.confirm('Are you sure that you want to delete this post');
        if(!res) return;
        setDeleting(true);
        await removePost(post._id);
        setDeleting(false);
    }
    return(
        <Col xs={12}>
        <Card border="primary" className="my-2 mx-auto">
            <Card.Header>
                <strong>{post.subject}</strong>
                <span className="float-end">&lt; {postedAgo === 1 ? '1 Hr' : `${postedAgo} Hrs`} ago</span>
            </Card.Header>
            <Card.Body>
                <Card.Text>{post.post}</Card.Text>
            </Card.Body>
            <Card.Footer >
                <Row xs={2}>
                    <Col xs={8} className="align-self-center my-2">
                        <strong><Icons.ClockHistory className="me-1 fw-bold"/></strong> Expires in <strong>&lt; {expiry < 0 ? 'Expired' : (expiry === 1 ? '< 1 Hr' : `${expiry} Hrs`)}</strong>
                    </Col>
                    <Col xs={4} className="mx-md-auto d-grid">
                        {isDeleting ? <Spinner variant="danger" animation="grow" className="mx-auto"/> : <Button variant="danger" type="button" onClick={handleDelete}> <Icons.Trash className="me-sm-2"/> {width >= 576 && "Delete"} </Button>}
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
        </Col>
    );
}