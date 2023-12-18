import axios from 'axios';

/*
    configures axios to intercept every response from server and verify if the JWT has expired and response is returned as it is.
    If expired, user is redirected to home page after 5.5 sec. Meanwhile the returned response will cause a toast to show up for 5 sec
    Otherwise the application proceeds as usual.
*/
export const initialiseAxios = () => {
    axios.interceptors.response.use((response) => {
        if(response.data.status === 401 && response.code === 'revoked_token'){
            setTimeout(()=>{window.location = '/';}, 5500);
        }
        return response;
      }, (error) => {
        console.log(error);
        return error.response;
      });
}

/*
    attaches the httpOnly cookie containing token to the request and the server check validity of the token
    If user already has a valid token, the user info from response is returned. Or else returns false.
*/
export const wakeUpandCheckUser = async () => {
    try{
        const res = await axios.get('/api/auth/checkUser', {withCredentials: true});
        if(res.data.status === 401){
            return {signedin: false, message: res.data.message, userInfo: null};
        }else{
            let content = res.data.email;
            content = content.substring(0, content.indexOf("@"));
            return {signedin: true, message: null, userInfo: {_id: res.data._id, email: res.data.email, name: content}};
        }
    }catch(err){
        return {signedin:false, message:null, userInfo: null};
    };
}

// Sends a sign in request and returns the response.
export const signin = async ({email, password}) => {
    try {
        const res = await axios.post('/api/auth/signin', {email, password});
        if(res.data.status === 401){
            return {signedin: false, message: res.data.message};
        }else{
            let content = res.data.email;
            content = content.substring(0, content.indexOf("@"));
            return {signedin: true, userInfo: {_id: res.data._id, email: res.data.email, name: content}};
        }
    } catch (err) {
        return {signedin: false, message: "Internal Server Error: Try Again"};
    }
}

// Sends a sign up request and confirms request being processed by the server
export const signup = async ({email, password}) => {
    try {
        const res = await axios.post('/api/auth/signup', {email, password});
        if(res.data.status === 401){
            return {signedup: false, message: res.data.message};
        }else{
            return {signedup: true, message: "Sign Up Successful. Check the Confirmation Mail sent to your Email Address"};
        }
    } catch (err) {
        return {signedup: false, message: "Internal Server Error: Try Again"};
    }
}

// Sends a signout request to server upon which the cookie containing the JWT is cleared. Returns sign out status
export const signout = async () => {
    try {
        const res = await axios.post('/api/auth/signout', {}, {withCredentials: true});
        if(res.status === 200){
            return {status: 200, message: 'Signed out successfully'};
        }else{
            return {status: 500, message: 'Failed to Sign you out. Try again later.'};
        }
    } catch (err) {
        return {status: 500, message: "Failed to Sign you out. Try again later."};
    }
}

// V=clicking the verification link in the confirmation mail triggers this function and user is marked as verified in DB
export const verifyUser = async (userId) => {
    try {
        const res = await axios.post('/api/auth/confirm/' + userId).catch(err => {});
        if(res.status === 200){
            return {verified: true, message: res.data.message}
        }else{
            return {verified: false, message: 'failed'};
        }
    } catch (err) {
        return {verified: false, message: "failed"}
    }
}