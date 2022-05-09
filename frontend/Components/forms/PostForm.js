import axios from 'axios';
import React, { useState , useContext , useEffect } from 'react';
import {toast} from 'react-toastify';
import 'react-quill/dist/quill.snow.css'; // ES6
import dynamic from 'next/dynamic';
const ReactQuill = dynamic( ()=>  import('react-quill') , { ssr: false });
import { UserContext } from '../../context/userContext';
// import io from 'socket.io-client';

// const socket = io("http://localhost:4000" , {
//     reconnection: true,
// });

const PostForm = (props) => {
    const [post , setPost ] = useState("");//Post Data Hook
    const [image , setImage ] = useState({});//Image Hook for uploading url and public id

    const [imageLoading , setImageLoading ] = useState(false);
    const [ userState ] = useContext(UserContext);

    
    const changePostData = (e) => {
        setPost(e);
    }
    // submit Post
    const submitPost = (e) => {
        e.preventDefault();
        if(post==""){
            toast.error("Question is required");
        }
        else{
        axios.post("http://localhost:4000/post/createPost" , {userState , post , image }).then(data => {
            props.fetchPosts();
            // socket.emit("new-post" , data.data);
            toast.success("Question posted Successfully.");
            setPost('');
            setImage({});
        }).catch(err=> {
            toast.error(err);
        });
    }
    }
    // end of post

    //upload image
    const handleImage = async (e) => {
        setImageLoading(true);
        e.preventDefault();
        const file = e.target.files[0];
        let formData = new FormData();
        formData.append("image" , file);
        
        axios.post("http://localhost:4000/post/uploadImagePost" , formData).then(data => {
            // console.log(data);
            setImage({
                url: data.data.url,
                public_id: data.data.public_id
            })
            setImageLoading(false);
        }).then(err=> {
            console.log(err);
            setImageLoading(false);
        });
    }

    return (
        <>
            <div className='PostFormBox'>
                <form className='PostForm' onSubmit={submitPost}>
                    <div className='inputPostBox form-group'>
                        <ReactQuill theme='snow' value={post} onChange={changePostData} required className='form-control inputPost' placeholder='Enter Your Question...'></ReactQuill>
                    </div>
                    <div className='postBtnBox form-control d-flex justify-content-between'>
                        <button type='submit' className='btn btn-warning postBtn'>Post</button>
                        <div className='imageUploadBox'>
                            <label className='labelImageUpload'>
                              {
                                  // Conditionally showing image and loading
                                  imageLoading ? (
                                    <div className="spinner-border text-warning"></div>
                                  ) : (
                                    <img src={image && image.url ? image.url : "images/Add Camera_96px.png"} style={{cursor: "pointer"}} className="rounded-circle mt-2" width='25px'/>
                                  )
                              }
                                <input  type='file' className='form-control' accept='image/*' name='imageUpload' onChange={handleImage} hidden/>
                            </label>
                        </div>
                    </div>
                </form> 
            </div>
        </>
    );
}

export default PostForm;