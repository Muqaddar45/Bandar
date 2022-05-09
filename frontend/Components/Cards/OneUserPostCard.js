import React, { useEffect , useContext , useState} from 'react';
import { UserContext } from '../../context/userContext';
import moment from 'moment';
import renderHTML from 'react-render-html';
import {useRouter} from 'next/router';
import axios from 'axios';
import {toast} from 'react-toastify';
import NextLink from 'next/link';

const OneUserPostCard = (props) => {
    
    //deleting post function
    const handleDeletePost = (_id) => {
        const check = window.confirm("Are You Sure to Delete this post");
        if(!check)
        {
            return
        }
        axios.delete("http://localhost:4000/post/deletePost/"+_id).then(data => {
            toast.error(data.data);
            getUserPosts();
        }).catch(err => {
            toast.error(err);
        });

    }
    //end of deleting post function

    const router = useRouter();
    const [ userState ] = useContext(UserContext);
    
    const {postId ,text , postedBy , image , like , comments , createdAt , getUserPosts , handleLike , handleUnLike} = props;
    const [posts , setPosts ] = useState(props);
    useEffect ( () => {
        setPosts(props);
    }, [props.like]);

    return (
        <>
            <div className='PostCardOuterBox  d-flex justify-content-center mt-4 p-3'>
                <div className='PostCardInnerBox w-50' style={{backgroundColor:  'purple' , borderRadius: '10px'}}>
                    <div className='PostCardHeader d-flex p-2 justify-content-between'>
                     {userState && userState.token ? (
                        <NextLink href={`/UserProfile/${userState.user._id}`}>
                        {
                           ( postedBy && postedBy.image ) ? (
                            <img style={{cursor: "pointer"}} src={postedBy.image.url} width="30px" height="30px" className="rounded-circle" alt="image not found"></img>
                           ):(
                            <span style={{color: 'white', backgroundColor: 'grey' , width: '30px' , height: "30px" , textAlign: 'center' , paddingTop: "3px" , cursor: "pointer"}} className='rounded-circle'>{postedBy ? postedBy.name.charAt(0): ""}</span> 
                           )
                        }
                        </NextLink>
                     ): (
                        ""
                     )}
                        <span className='text-light flex-grow-1 mx-2'>{postedBy ? postedBy.name : ""}</span>
                        <p className="text-light order-3">{moment(createdAt).fromNow()}</p>
                    </div>
                    <div className='PostCardBody d-flex flex-column px-2'>
                        <span className='text-light PostCardBodyQuestion'>{renderHTML(text)}</span>
                        { 
                          image && image.url ? 
                          (
                           <div className='w-75 d-flex rounded justify-content-center align-self-center' style={{overflow: "hidden" , height: '150px' }} >
                             <img width='100%' className='align-self-center rounded' src={image.url} alt='image Not found, connection error'></img>  
                           </div>
                          ) :
                         ""  
                        }
                    </div>
                    <hr className='text-light'></hr>
                    <div className='PostCardFooter pb-2  d-flex justify-content-around'>
                        <span style={{cursor: "pointer"}} onClick={ () => {  posts && posts.like && userState && userState.token ? posts.like.includes(userState.user._id) ? handleUnLike(postId) : handleLike(postId) :  ""}}  className='text-light'>
                            <img src={posts && posts.like && userState && userState.token ? posts.like.includes(userState.user._id) ? '../images/likeFill.png' : '../images/likeOutline.png' : '../images/likeOutline.png'} width="20px"></img> {posts && posts.like ? posts.like.length : ""}</span>
                        <span style={{cursor: "pointer"}} onClick={ () => {  }} className='text-light'><img src='../images/commentOutline.png' width="20px"></img></span>

                        {

                           ( postedBy &&  userState )  ? (
                             <>
                                <span className='text-light'><img src='../images/edit.png' onClick={ ()=> { router.push(`/Post/updatePost/${postId}`)}} style={{cursor:'pointer'}} width="20px"></img></span>
                                <span className='text-light'><img src='../images/delete.png' onClick={ ()=> {handleDeletePost((postId))} } style={{cursor:'pointer'}} width="20px"></img></span>
                             </>
                            ) : ("")
                         }
                        
                    </div>
                </div>
            </div>
        </>
    );
}

export default OneUserPostCard;