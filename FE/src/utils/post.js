// get no of hours before expiry of the post based on expiresAt field
export const getExpiry = (post) => {
    let expiry = new Date(post.expiresAt);
    if(expiry.getTime() < new Date().getTime()) return -1;
    return Math.ceil(Math.abs(expiry - new Date()) / 36e5);
};

// get no of hours since posted based on createdAt field
export const getPostedAgo = (post) => {
    let posted = new Date(post.createdAt);
    return Math.ceil(Math.abs(posted - new Date()) / 36e5);
};

// trim the name to have a maximum of 12 characters
export const getTrimmed = (name) => {
    if(name.length > 20){
        return name.slice(0, 12) + ' . . .';
    }else return name
}