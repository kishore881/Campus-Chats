import axios from 'axios';

// gets all posts which are currently not expired yet (live posts)
export const getPosts = async () => {
    try{
        const res = await axios.get('/api/post/getall', {withCredentials: true});
        if(res.data.status !== 401){
            return {status: 'success', posts: res.data.posts}
        }else{
            return {status: 'failed', posts: []}
        }
    }catch(err){
        return {status: 'failed', posts: []}
    }
}

// requests server to create new post with given data and attach the user from the token as its author. Return the status of the request
export const createPost = async ({subject, post, expiry}) => {
    try{
        const res = await axios.post('/api/post', {subject, post, expiry}, {withCredentials: true});
        if(res.data.status === 401){
            return {posted: false, message: res.data.message, post: null};
        }else{
            return {posted: true, message: null, post: res.data.post};
        }
    }catch(err){
        return {posted: false, message: 'Failed to create new post', post: null}
    }
}

// requests server to delete the post with given id and the deletion status is returned
export const deletePost = async (id) => {
    try{
        const res = await axios.delete(`api/post/${id}`, {withCredentials: true});
        if(res.data.status === 401){
            return {status: 'failed', message: res.data.message, post: null};
        }else{
            return {status: 'success', message: null, post: res.data.post};
        }
    }catch(err){
        return {status: 'failed', message: 'Failed to delete the post', post: null};
    }
}

// requests for the currently live posts written by user
export const getUserPosts = async () => {
    try{
        const res = await axios.get('/api/post/getbyuser', {withCredentials: true});
        if(res.data.status !== 401){
            return {status: 'success', message: null, posts: res.data.posts}
        }else{
            return {status: 'failed', message: res.data.message, posts: []}
        }
    }catch(err){
        return {status: 'failed', message: 'Failed to fetch posts', posts: []}
    }
}