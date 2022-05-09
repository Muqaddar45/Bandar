import React, { useState , useEffect , useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';
import PostForm from '../Components/forms/PostForm';
import PostCard from '../Components/Cards/PostCard';
import axios from 'axios';
import  {io} from 'socket.io-client';
import { toast } from 'react-toastify';

const socket = io("http://localhost:4000" , {
    reconnection: true,
});
const UserDash = () => {

    useEffect ( () => {
        socket.on("post-like", like => {
            const {postedById , likesBy } = like;
            if(postedById == userState.user._id){
                toast(likesBy+" Like Your post.");
                fetchAllPosts();
            }
        });
        socket.on("post-comment" , comment => {
            const postedById = comment.postedById;
            const postCommentBy = comment.postCommentBy;
            
            if(postedById == userState.user._id && postCommentBy != userState.user.name){
                toast(postCommentBy+" comment your post.");
                fetchAllPosts();
            }
        });
    },[]);
    
    const [allPosts , setAllPosts ] = useState([]); // all post to be display
    const router = useRouter();
    const [ userState , setUserState ] = useContext(UserContext);//userSTate

    //pagination hooks
    const [currentPage , setCurrentPage ] = useState(1);
    const [ postsPerPage ] = useState(20);
    const indexOfLastIndex = currentPage * postsPerPage;
    const indexOfFirstIndex = indexOfLastIndex - postsPerPage;

    const currentPosts = allPosts.slice(indexOfFirstIndex , indexOfLastIndex);
    const pages = [];
    for(let i = 1 ; i <= Math.ceil(allPosts.length / postsPerPage); i++){
        pages.push(i);
    }
    const handlePagination = (page) => {
        setCurrentPage(page);
    }
    //end of pagination section.

    // UseEffect for fetching all the Post
    useEffect( () => {
        if(userState && userState.token)
        {
            fetchAllPosts();
        }
        else{
           router.push("/"); 
        }
    }, [allPosts && userState]);
    //end of useEffect

     //handle like and unlike functions

     const handleLike = (postId) => {
        // console.log(postId);
        axios.post('http://localhost:4000/post/postLike' , {postId , userId: userState.user._id}).then( data => {
            fetchAllPosts();
            const  postedById = data.data.postedBy._id;
            const likesBy = userState.user.name;
            
            socket.emit("post-like" , {postedById , likesBy});
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

    //handle comment on a post
    const handleComment = (postId) => {
        router.push("/CommentOnPost/"+postId);
    }
    //end of comment on a post

    //fetch all the posts function
    const fetchAllPosts =  async () => {
        await axios.get("http://localhost:4000/post/allPosts").then(data => {
            setAllPosts(data.data);
        }).catch(err => {
            console.log(err);
        });
    }
        //end of fetching post functions
    return (
        <>
            <div className='userDashOuterBox container'>
                <div className='userDashInnerBox'>
                    <div className='postOuterBox d-flex justify-content-center'>
                        <div className='postInnerBox w-75'>
                            <PostForm
                                fetchPosts={fetchAllPosts} 
                                userState
                            ></PostForm>
                        </div>
                    </div>     
                    <div className='newsFeedAreaOuterBox container d-flex justify-content-center'>
                        <div className='newsFeedAreaInnerBox w-75  mt-4 bg-warning row d-flex justify-content-center' style={{borderRadius: '10px'}}>
                            {
                                currentPosts.map( post => {
                                 return (
                                    <PostCard 
                                        key={post._id}
                                        postId={post._id}
                                        text={post.text}
                                        postedBy={post.postedBy}
                                        image={post.image}
                                        like={post.likes}
                                        comments={post.comments}
                                        createdAt={post.createdAt}
                                        fetchAllPosts={fetchAllPosts}
                                        handleLike={handleLike}
                                        handleUnLike={handleUnLike}
                                        handleComment={handleComment}
                                        className="Posts"
                                    ></PostCard>
                                 )
                                })
                            } 
                            <nav className='paginationNav mt-2' style={{cursor: 'pointer'}}>
                        <ul className="pagination justify-content-center">
                        <li className="page-item" onClick={()=> {if(currentPage>1)setCurrentPage(--currentPage)}}><a className="page-link">Previous</a></li>                         
                                
                            {
                                pages.map(page => {
                                    return (
                                        <li className={ page==currentPage ? "active page-item" : "page-item" } key={page}   onClick={ () => {handlePagination(page)}}><a className="page-link">{page}</a></li>   
                                    );
                                })
                            }   
                            <li className="page-item" onClick={()=> {if(currentPage<pages.length)setCurrentPage(++currentPage)}}><a className="page-link" >Next</a></li>
                        </ul>
                    </nav>                       
                        </div>
                        
                    </div>
                    
                                                
                </div>
            </div>
                
        </>
    
  );
}

export default UserDash;