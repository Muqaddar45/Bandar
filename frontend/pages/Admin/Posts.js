import React, { useEffect , useContext , useState} from "react";
import { UserContext } from "../../context/userContext";
import { useRouter } from "next/router";
import renderHTML from 'react-render-html';
import axios from 'axios';
import {toast} from 'react-toastify';
const Posts = () => {
    const [ userState ] = useContext(UserContext);
    const router = useRouter();
    const [ posts , setPosts ] = useState([]);
    useEffect( ()=> {
        
        if(!(userState && userState.user && userState.token)){
            router.push("/");
        }
        if(!(userState && userState.user.role == "Admin")){
            router.push("/UserDash");
        }
        fetchPosts();
    } , [userState]);

    const handleDelete = (postId) => {
        axios.delete("http://localhost:4000/post/deletePost/"+postId).then(data => {
            toast(data.data);
            fetchPosts();
        }).catch(err => {

        });
    }

    const fetchPosts = () => {
        axios.get("http://localhost:4000/post/allPosts").then(data => {
            setPosts(data.data);
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <>
            <div className="managePostsPage container" style={{height: "88vh"}}>
                <div className="managePostsOuterBox">
                    <div className="managePostsInnerBox">
                        <div className="ManagePostsTitle">
                            <h4>Manage All Posts of in the Application</h4>
                        </div>
                        <div className="AllPostsBox">
                            <div className="AllPostsTableBox">
                            <table className="table table-striped table-responsive  table-bordered table-hover" style={{textAlign: "center"}}>
                            <thead>
                            <tr className="text-light " style={{backgroundColor: "purple"}}>
                                <th>Post</th>
                                <th>Posted By</th>
                                <th>Likes</th>
                                <th>Comments</th>
                                <th>Created At</th>
                                <th>Image</th>                    
                                <th>Delete</th>
                            </tr>
                            </thead>
                                <tbody>
                                {
                                    posts ? (
                                        posts.map( post => {
                                            return (
                                                <tr key={post._id} className="" style={{backgroundColor: "#f1c40f"}}>
                                                    <td>{renderHTML(post.text)}</td>
                                                    <td>{post.postedBy ? post.postedBy.name: "nono"}</td>
                                                    <td>{post.likes? post.likes.length: "none"}</td>
                                                    <td>{post.comments ? post.comments.length : "none"}</td>
                                                    <td>{new Date(post.createdAt).getDate()+"-"+new Date(post.createdAt).getMonth()+"-"+new Date(post.createdAt).getFullYear()}</td>  
                                                    <td>{post.image ? <img src={post.image ? post.image.url : ""} width="30px" alt="image not load"></img> : "none"}</td>
                                                    <td onClick={ () => { handleDelete(post._id)}} style={{cursor: "pointer" , textAlign: "center"}}><img  width="20px"src="./../images/Delete_96px_2.png"></img></td>
                                                    </tr>
                                            );
                                        })
                                    ) : (
                                        <tr className="" style={{backgroundColor: "#f1c40f"}}>
                                            <td>none</td>
                                            <td>none</td>
                                            <td>none</td>
                                            <td>none</td>
                                            <td>none</td>
                                            <td>none</td>  
                                            <td style={{cursor: "pointer" , textAlign: "center"}}><img  width="20px"src="./../images/Delete_96px_2.png"></img></td>
                                         </tr>
                                    )
                                }      
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Posts;