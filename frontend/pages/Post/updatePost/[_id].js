import React, { useState , useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../../../context/userContext';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css'; // ES6
import dynamic from 'next/dynamic';
const ReactQuill = dynamic( ()=>  import('react-quill') , { ssr: false });
import {toast} from 'react-toastify';

const UpdatePost = () => {

    const [ userState ] = useContext(UserContext);
    const [ post , setPost ] = useState({});
    const router = useRouter();
    const postId = router.query._id;
    const [text , setNewTextPost ] = useState("");

    const changePostData = (e) => {
        setNewTextPost(e);
    }

    useEffect( ()=> {
        if( !userState ){
            router.push("/");
        }
        fetchPost();
        console.log(post);
    } , [postId]);

    //Fetching post request function
    const fetchPost = () => {
        axios.get("http://localhost:4000/post/getPost/:"+postId).then(data => {
            setPost(data.data);
            setNewPostText(post.text);
        }).catch(err => {
            console.log(err);
        });
    }
    //end of fetching post function

    //update data and image
     const submitPostUpdate = (e) => {
        e.preventDefault();
        axios.put("http://localhost:4000/post/updatePost/:"+postId , {text} ).then(data => {
            toast.success(data.data);
            setPost({});
            router.push("/UserDash");
        }).catch(err => {
            toast.error(err);
        });
    }
    // end of post

    return (
        <>
        <div className='PostFormBox d-flex flex-column align-items-center mt-5 container'>
        <div className='updatePostTitleBox align-self-start'>
            <h3>Update Your Post</h3>
        </div>
        <form className='PostForm w-50' onSubmit={submitPostUpdate}>
            <div className='inputPostBox form-group'>
                <ReactQuill theme='snow' value={text == "" ?  post.text : text} onChange={changePostData} required className='form-control inputPost' placeholder='Enter Your Question...'></ReactQuill>
            </div>
            <div className='postBtnBox form-control d-flex justify-content-between'>
                <button type='submit' className='btn btn-warning postBtn'>Update</button>
            </div>
        </form> 
    </div>
        </>
    );
}
export default UpdatePost;