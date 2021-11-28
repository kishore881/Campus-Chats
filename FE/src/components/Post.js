import { Card, Col } from "react-bootstrap";
import { getExpiry, getPostedAgo, getTrimmed } from "../utils/post"
import { Icons } from "./icons";

export default function Post({post}){
    const postedAgo = getPostedAgo(post);
    const expiry = getExpiry(post);
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
                    <span xs={12} sm={6}> <strong><Icons.ClockHistory className="me-1 fw-bold"/></strong> Expires in <strong>&lt; {expiry < 0 ? 'Expired' : (expiry === 1 ? '1 Hr' : `${expiry} Hrs`)}</strong></span>
                    <span className="float-end">- <strong>{getTrimmed(post.authorName)}</strong></span>
            </Card.Footer>
        </Card>
        </Col>
    );
}