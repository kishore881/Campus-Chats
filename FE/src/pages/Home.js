import {useState, useEffect, useRef} from 'react';
import {Container, Row, Col, Nav, Spinner, Form} from "react-bootstrap";
import Post from "../components/Post";
import NewPost from "../components/NewPost";
import {getPosts} from '../services/post'
import { Icons } from '../components/icons';

export default function Home({user}) {
    const [posts, setPosts] = useState([]);
    const [isFetching, setFetching] = useState(true);
    const [order, setOrder] = useState('Latest');
    const [searchTerm, setSearch] = useState('');
    const [searchTarget, setTarget] = useState('subject');
    const previousValues = useRef({order, searchTerm});

    // based on current tab Latest or Expiring Soon, orders the post accordingly
    function sortPostsInOrder(posts) {
        if(order === 'expiringSoon'){
            posts.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
        }else{
            posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return posts;
    }

    // based on current searchTerm and searchTarget sets visibility of the post to true or false
    function setVisibility(posts){
        posts.forEach((post, index, arr) => {
            post['visible'] = searchTerm === '' || post[searchTarget].toLowerCase().indexOf(searchTerm) !== -1 ? true: false;
            arr[index] = post;
        });
        return posts;
    }

    // updates the posts with new data after applying the sorting and filters on it
    function setDataAprop(posts){
        posts = sortPostsInOrder(posts);
        posts = setVisibility(posts);
        setPosts(posts);
    }

    // actual function calling the getPosts from post services and passes it to setDataAprop
    const getData = async () => {
        const {status, posts} = await getPosts();
        if(status === 'success'){
            setDataAprop(posts);
        }else{
            console.log('fetch failed');
        }
    }

    // fetches live posts on load and sets a timer for a periodic refresh of data
    useEffect(() => {

        getData().then(() => {setFetching(false);});

        const refreshInterval=setInterval(()=>{getData()},60000);
        return()=>{clearInterval(refreshInterval);};
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // rearranges posts array everytime ordering or filtering is changed
    useEffect(() => {
        if(previousValues.current.order !== order){
            previousValues.current.order = order;
            setPosts(sortPostsInOrder(posts.slice()));
        }
        if(previousValues.current.searchTerm !== searchTerm){
            previousValues.current.searchTerm = searchTerm;
            setPosts(setVisibility(posts.slice()));
        }
    },[searchTerm, order]); // eslint-disable-line react-hooks/exhaustive-deps

    // passed down to <NewPost/> element to add the post immediately to the application state on success
    const addPost = (post) => {
        setDataAprop([post, ...posts]);
    }

    /* function gets called with corresponding event key when the pills Latest or Ending Soon are clicked. 
        updates the state variable 'order' triggering the useEffect*/
    const handleSelect = (eventKey) => {
        setOrder(eventKey);
    };

    // gets called when the input field for entering search filter changes. updates the state variable 'searchTerm' triggering the useEffect
    const handleFilter = (event) => {
        let filter = event.target.value;
        setSearch(filter);
    }

    /* gets called when the the target for serach flter (post subject or body or the author name) changes.
        resets the state variable 'searchTerm' and 'searchTarget' triggers the useEffect since 'searchTerm' changed */
    const handleSearchTarget = (event) => {
        let target = event.target.value;
        setTarget(target);
        setSearch('');
    }

    return(
        <Container fluid="lg">
            <Row className="mx-auto" style={{maxWidth:"720px"}}>
                <NewPost addPost={addPost}/>
                <Col xs={12}>
                    <Nav className="mx-auto fw-bold d-flex justify-content-center" variant="pills" defaultActiveKey="Latest" onSelect={handleSelect}  style={{maxWidth:"660px"}}>
                        <Nav.Item className="m-1">
                            <Nav.Link eventKey="Latest">Latest Posts</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="m-1">
                            <Nav.Link eventKey="expiringSoon">Expiring Soon</Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="form-group align-self-center">
                            <Form.Group className="m-1 input-group">
                                <span className="bg-primary input-group-text"><Icons.Filter className="text-white"/></span>
                                <Form.Select className="shadow-none" style={{maxWidth: "fit-content"}} onChange={handleSearchTarget}>
                                    <option value="subject">Subject</option>
                                    <option value="post">Post</option>
                                    <option value="authorName">Posted By</option>
                                </Form.Select>
                                <Form.Control value={searchTerm} type="text" placeholder={searchTarget === 'author' ? "Filter by username" : (searchTarget === 'post' ? "Filter by Content" : "Filter by subject")} className="shadow-none" aria-label="Filter by username" onChange={handleFilter}/>
                            </Form.Group>
                        </Nav.Item>
                    </Nav>
                </Col>
                {
                    isFetching && (
                        <Spinner className="my-5 m-auto" animation="grow" size="lg" variant="primary"/>
                    )
                }
                {
                    posts.map((post, index, arr) => {
                        return (post.visible && <Post key={post._id} post={post}/>);
                    })
                }
                {
                    !isFetching && posts.length === 0 && (
                        <div className="my-5 text-center">
                            <h5>👋 Hi there... See this emptiness... <br/> Why don't you share what you're looking forward to.</h5>
                        </div>
                    )
                }
            </Row>
        </Container>
    );
}