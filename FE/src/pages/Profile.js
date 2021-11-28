import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { getUserPosts, deletePost } from '../services/post';
import Toaster from '../components/Toaster';
import PostwithActions from '../components/PostwithActions';

export default function Profile({user}){
    const [posts, setPosts] = useState([]);
    const [isFetching, setFetching] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // calls the getUserPosts from post service and updates the state
    const getData = async () => {
        let {status, message, posts} = await getUserPosts();
        if(status === 'success'){
            setPosts(posts);
        }else{
            setError(message    );
        }
    }

    // triggers getData on page load
    useEffect(() => {
        getData().then(() => {setFetching(false);});
    }, []);

    // function being passed to PostwithActions component for it trigger the post deletion when delete button is clicked
    const removePost = async (id) => {
        let {status} = await deletePost(id);
        if(status === 'success'){
            setPosts(posts.slice().filter(post => post._id !== id));
            setMessage("Post deleted successfully");
        }else{
            setError("Failed to delete post. Try again");
        }
    }

    return(
        <Container fluid="lg">
            <Row className="mx-auto" style={{maxWidth:"720px"}}>
                <Col xs={12}>
                    <h4 className="my-3 text-center">{`👋 Hi...  ${user.name}`}</h4>
                    <hr className="m-0"/>
                </Col>
                <Col xs={12}>
                    <h4 className="my-2">Currently Active Posts</h4>
                </Col>
                {
                    isFetching && (
                        <Spinner className="my-5 m-auto" animation="grow" size="lg" variant="primary"/>
                    )
                }
                {
                    posts.map((post, index, arr) => {
                        return (<PostwithActions key={post._id} post={post} removePost={removePost}/>);
                    })
                }
                {
                    !isFetching && posts.length === 0 && (
                        <div className="my-5 text-center">
                            <h5 className="">See this emptiness... <br/> Why don't you share what you're looking forward to.</h5>
                        </div>
                    )
                }
            </Row>
            {error && (<Toaster variant="warning" message={error} action="Delete Post" callback={()=>setError(null)}/>)} 
            {message && (<Toaster variant="success" message={message} action="Delete Post" callback={()=>setMessage(null)}/>)} 
        </Container>
    );
}