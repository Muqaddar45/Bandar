import React, { useEffect , useContext, useState} from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import {toast} from 'react-toastify';
import OneUserPostCard from '../../Components/Cards/OneUserPostCard';
import NextLink from 'next/link';

const UserProfile = () => {
    const [userState] = useContext(UserContext);
    const router = useRouter();
    const userId = router.query._id;
    //user info hook
    const [user , setUser ] = useState({});

    // user posts hook
    const [posts , setPosts ] = useState([]); 
    useEffect( () => {
        if(!(userState && userState.token)){
            router.push("/");
        }
        if(userId){
            getUserData();
            getUserPosts();
        }
    } , [userState] );

    //function that get User information
    const getUserData = () => {
        axios.get("http://localhost:4000/user/getOneUser/"+userId).then(data => {
            setUser(data.data);
        }).catch( err=> {
            toast.error(err);
            router.push("/UserDash");
        });
    } 
    //end of getting info function

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
            getUserPosts();
        }).catch(err => {
            console.log(err);
        });
    }
    //end of like and unlike functions


    //function that get all post of this user
    const getUserPosts = () => {
        axios.get(`http://localhost:4000/post/getOneUserPosts/${userId}`).then(data => {
            setPosts(data.data);
            getUserPosts();
        }).catch(err => {
            toast.error(err);
            router.push("/UserDash");
        });
    }
    //end of getting posts function

    return (
        <>
            <div className='UserProfilePageBox container'>
                <div className='UserProfileOuterBox'>
                    <div className='UserProfileInnerBox d-flex flex-column '>
                        <div className='UserProfileBox bg-warning rounded mt-3'>
                            <div className='NameAndImageProfile p-4 d-flex justify-content-around'>
                                <div className='ImageProfile px-5'>
                                  {
                                    user.image ? (
                                        <img width='90px' height="90px" src={user.image ? user.image.url : ""} alt="Image Not found! connection Error"  className='rounded-circle'></img>
                                    ): 
                                        <span className='rounded-circle py-3 px-3' style={{ color: "purple" , fontWeight: "bold" , border: "2px solid purple"}}>{user.name ? user.name.charAt(0) : ""}</span>
                                    }
                                </div>
                                <div className='userNameProfileBox align-self-center px-4' >
                                    <h3 style={{letterSpacing: "5px" , color: "purple" , fontWeight: "bold"}} className='UserName'>{user.name}</h3>
                                </div>
                                <div className='userProfileUpdateBox align-self-center'>
                                  {
                                       (userState && userState.token) ? userState.user._id == user._id ? (
                                        <span onClick={ ()=> { router.push(`/UserProfileUpdate/${user._id}`)}} style={{cursor: "pointer" , textDecoration: "none" , color: "purple" , fontWeight: "bold"}}><button className='btn' style={{backgroundColor: "purple" , color: "white"}}>Update Profile</button></span>
                                      ) : (
                                          ""
                                      ) : ""
                                  }
                                </div>
                            </div>
                            <div className='MoreInfoBox px-5 pb-2'>
                                <div className='MoreInfoInnerBox' style={{color:"purple"}}>
                                    <p className='moreInfoText'>More Information</p>
                                    <p className='profileInfo'>Email: {user.email}</p>
                                    <p className='profileInfo'>Phone Number: 0{user.phoneNumber}</p>
                                    <p className='profileInfo'>Account Created At: {Date(user.createdAt).toString()}</p>
                                </div>
                            </div>
                        </div>
                        
                        
                        <div className='allPostOfThisUserBox bg-warning w-75 align-self-center'>
                        <h4 className='allPostsTitle p-2' style={{color: 'purple' , textAlign: "center"}}>{user.name} all Posts</h4>
                            {
                                posts.map( post => {
                                    return(
                                       <OneUserPostCard
                                            key={post._id}
                                            postId={post._id}
                                            text={post.text}
                                            postedBy={post.postedBy}
                                            image={post.image}
                                            like={post.likes}
                                            comments={post.comments}
                                            createdAt={post.createdAt}
                                            getUserPosts={getUserPosts}
                                            handleLike = {handleLike}
                                            handleUnLike= {handleUnLike}
                                            >
                                        </OneUserPostCard> 
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserProfile;