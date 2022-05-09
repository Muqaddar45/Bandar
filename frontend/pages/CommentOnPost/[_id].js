import React , {useState , useContext, useEffect} from  'react';
import { useRouter } from 'next/router';
import { UserContext } from '../../context/userContext';
import NextLink from 'next/link';
import axios from 'axios';
import moment from 'moment';
import renderHTML from 'react-render-html';
import {toast} from 'react-toastify';
import {io} from 'socket.io-client';

const socket = io("http://localhost:4000" , {
    reconnection: true,
});

const CommentOnPost = () => {
    const router = useRouter();
    const _id = router.query._id;
    const [ userState ] = useContext(UserContext);
    const [post , setPost ] = useState({_id : "" , text: "" , postedBy: {} ,});
    const [comment , setComment ] = useState("");
    const [comments , setComments ] = useState([]);



    //getting comment data from textarea
    const getComment = (e) => {
        setComment(e.target.value);
    }
    //end of getting data from comment

    //submiting comment function 
    const submitComment = (e) => {
        e.preventDefault();
        let userId = userState.user._id;
        axios.post("http://localhost:4000/post/commentOnPost/"+_id , {comment , userId}).then(data => {
            setComment("");
            const comment = {
                postedById: post.postedBy._id,
                postCommentBy: userState.user.name,
            }
            socket.emit("post-comment" , comment);
        }).catch(err => {
            toast.error(err);
        });
    }
    useEffect ( () => {
        if(!userState){
            router.push("/");
        }
        axios.get("http://localhost:4000/post/getOnePost/"+_id).then(data => {
            setPost(data.data);
            setComments(data.data.comments);
        }).catch( err => {
            console.log(err);
        });
        
    } ,[comment , userState]);
    //deleting post function
    const handleDeletePost = (_id) => {
        const check = window.confirm("Are You Sure to Delete this post");
        if(!check)
        {
            return
        }
        axios.delete("http://localhost:4000/post/deletePost/"+_id).then(data => {
            toast.error(data.data);
            fetchAllPosts();
        }).catch(err => {
            toast.error(err);
        });

    }
    //end of deleting post function
    //handle like and unlike functions

    const handleLike = (postId) => {
        // console.log(postId);
        axios.post('http://localhost:4000/post/postLike' , {postId , userId: userState.user._id}).then( data => {
            fetchAllPosts();
        }).catch(err => {
            console.log(err);
        });
    }
    const handleUnLike = (postId) => {
        axios.post('http://localhost:4000/post/postUnlike' , {postId , userId: userState.user._id}).then( data => {
            // console.log(data.data);
            fetchAllPosts();
        }).catch(err => {
            console.log(err);
        });
    }
    //end of like and unlike functions
    return (
        <div className='commentPageBox container' style={{height: "88vh"}}>
            <h3 className='container' style={{color: 'purple' , fontWeight: "bold"}}>Post and Their Comments</h3>
            <div className='commentOnPostBox '>
                <div className='commentOnPostInnerBox d-flex justify-content-around'>
                    
                <div className='postCard w-75' style={{}}>
                    <div className='PostCardOuterBox  d-flex justify-content-center mt-1 p-3'>
                         <div className='PostCardInnerBox w-50' style={{backgroundColor:  'purple' , borderRadius: '10px'}}>
                            <div className='PostCardHeader d-flex p-2 justify-content-between'>
                                <NextLink href={post  ?  post.postedBy ? "/UserProfile/"+post.postedBy._id : "#" : ""} >
                                 {
                                    post ? post.postedBy && post.postedBy.image ? (
                                        <img style={{cursor: "pointer"}} src={post.postedBy.image.url} width="30px" height="30px" className="rounded-circle" alt="image not found"></img>
                                    ) : (
                                        <span style={{color: 'white', backgroundColor: 'grey', cursor:"pointer" , width: '30px' , height: "30px" , textAlign: 'center' , paddingTop: "3px"}} className='rounded-circle'> { post.postedBy ?  post.postedBy.name ? post.postedBy.name.charAt(0) : "" : ""}</span>
                                    ) : ""
                                } 
                                </NextLink>
                                <span className='text-light flex-grow-1 mx-2'>{post ? post.postedBy ? post.postedBy.name : "" : ""}</span>
                                <p className="text-light order-3">{post ? moment(post.createdAt).fromNow() : ""}</p>
                            </div>
                        <div className='PostCardBody d-flex flex-column px-2'>
                        <span className='text-light PostCardBodyQuestion'>{post && post.text ? renderHTML(post.text) : ""}</span>
                        { 
                           post ? post.image && post.image.url ? 
                            (
                               <div className='w-75 d-flex rounded justify-content-center align-self-center' style={{overflow: "hidden" , height: '150px' }} >
                                 <img width='100%' className='align-self-center rounded' src={post.image.url} alt='image Not found, connection error'></img>  
                               </div>
                            ) :
                                ""
                                : ""  
                            }
                    </div>
                        <hr className='text-light'></hr>
                        <div className='PostCardFooter pb-2  d-flex justify-content-around'>
                            <span style={{cursor: "pointer"}} onClick={ () => {  post && post.like && userState && userState.token ? posts.like.includes(userState.user._id) ? handleUnLike(postId) : handleLike(postId) :  ""}}  className='text-light'>
                                <img src={post && post.likes && userState && userState.token ? post.likes.includes(userState.user._id) ? '../images/likeFill.png' : '../images/likeOutline.png' : '../images/likeOutline.png'} width="20px"></img> {post && post.likes ? post.likes.length : ""}</span>
                            
                            <span style={{cursor: "pointer"}} onClick={ () =>  { handleComment(post._id) }} className='text-light'><img src='../images/commentOutline.png' width="20px"></img></span>
    
                            {
    
                               post ? (post.postedBy && post.postedBy._id && userState && userState.user)  ?  userState.user._id === post.postedBy._id ? (
                                 <div className=''>
                                    <span className='text-light mx-4'><img src='../images/edit.png' onClick={ ()=> { router.push(`../Post/updatePost/${_id}`)}} style={{cursor:'pointer'}} width="20px"></img></span>
                                    <span className='text-light'><img src='../images/delete.png' onClick={ ()=> {handleDeletePost((_id))} } style={{cursor:'pointer'}} width="20px"></img></span>
                                 </div>
                                ) :
                                (
                                    <div></div>
                                ) : ("") : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="commentInputOuterBox my-3" style={{width: "30%"}}>
                <div className='commentInputInnerBox'>
                    <form className='commentInputForm form' onSubmit={submitComment}>
                        <div className='commentInputBox form-group'>
                            <textarea value={comment}  required onChange={getComment} className='form-control CommentTextArea' style={{height: "20vh" , boxShadow: 'none' , outline: "none" , backgroundColor: "purple" , color: 'white'}} placeholder="Write comment here..."></textarea>
                        </div>
                        <div className='input-control my-4'>
                            <button type='submit' className='btn' style={{backgroundColor: "purple" , color: "white" , float: "right"}}>Comment</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div className='AllCommentBox bg-warning' style={{height: "48vh" , overflow:"scroll"}}> 
            <div className='AllCommentInnerBox d-flex flex-column align-items-center'>
                <h4>Comments</h4>
                {
                    comments.map( comment => {
                        return (
                            <div key={comment._id} className='oneCommentBox w-50 my-3 rounded' style={{backgroundColor: "purple"}}>
                                <div className='commentHeader p-1 d-flex justify-content-around'>
                                    <img alt='image not loaded' width={"20px"} height="20px" className='rounded-circle' src={comment ? comment.postedBy  ? comment.postedBy.image ?  comment.postedBy.image.url ? comment.postedBy.image.url : ""  : "" : "": "" }></img>
                                    <p className='commentBy text-light'>{comment ? comment.postedBy ? comment.postedBy.name : "" : ""}</p>
                                    <p className='text-light'>{comment ? moment(comment.createdAt).fromNow() : ""}</p>
                                </div>
                            <div className='commentBody'>
                                <p className='text-light mx-4'>{comment ? comment.text : ""}</p>
                            </div>
                            <div className='commentFooter'>
                        
                            </div>
                        </div>
                        );
                    })
                }
            </div>
        </div>
    </div>
</div>  
);
}

export default CommentOnPost;