import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {UserContext} from '../../context/userContext';
import NextLink from 'next/link';
import axios from 'axios';
import {toast} from 'react-toastify';

const SetProfilePic = () => {
    //save button loading hook
    const [btnLoading , setBtnLoading ] = useState(false);

    const [ userState ] = useContext(UserContext);
    //The file of the file that will set when image uploaded
    const [ image , setImage ] = useState({});

    const [profilePicPath , setProfilePicPath ] = useState("");
    useEffect ( () => {
        if((userState && userState.token)){
            router.push("/UserDash");
        }
    }, [userState]);
    const router = useRouter();
    //sending image to cloudinary
    const handleImage = (e) => {
        e.preventDefault();
        setBtnLoading(true);
        const file = e.target.files[0];
        const url = URL.createObjectURL(e.target.files[0]);
        setProfilePicPath(url);
        let formData = new FormData();
        formData.append("image" , file );
        axios.post("http://localhost:4000/user/profilePicUpload" , formData ).then( data => {
            setBtnLoading(false);
            setImage({
                url: data.data.url,
                public_id: data.data.public_id
            });
           
        }).then(err=> {
            setBtnLoading(false);
            console.log(err);   
        });
    }

    //function to submit form data to backend
    const postProfilePic = ( e ) => {
        e.preventDefault();
        
        if(image && image.public_id){
            axios.put("http://localhost:4000/user/profilePicUpdate/:"+router.query._id , {image}).then(data => {
                toast.success(data.data);
                router.push("/");
            }).catch(err=> {
                toast.error(err);
            });
        }
        else{
            toast.error("Image Not uploaded Yet");
        }

    }

    return (
        <>
            <div className='setProfilePageBox container d-flex justify-content-center'>
                <div className='setProfilePageInnerBox  w-50 bg-warning mt-4 p-4 rounded' style={{boxShadow: '0px 0px 10px 1px'}}>
                    <div className='ProfilePicTitleBox d-flex justify-content-around'>
                        <h4 className='ProfilePicTitle'>Set Your Profile Picture</h4>
                        <NextLink href="/"><button className='btn text-light' style={{backgroundColor: "purple"}}>Or Skip</button></NextLink>
                    </div>

                    <div className='ProfilePicFormBox'>
                        <form className='ProfilePicForm d-flex flex-column' onSubmit={postProfilePic}>
                            <div className='form-group PicBox mt-5 align-self-center'>
                                <label className='labelForPic' style={{cursor: 'pointer'}}>
                                    <img className='rounded-circle p-2' style={{border: '2px solid purple'}} width="130px" src={profilePicPath ? profilePicPath : '../images/profilePicDumme2.png'}></img><span ></span>
                                    {btnLoading ? <div className="spinner-grow" style={{color: "purple"}}></div> : ""}
                                    <input type='file' accept="image/*" hidden onChange={handleImage} placeholder="Select Profile Picture" className="form-control" />
                                </label>
                            </div>
                            <div className='btnBox align-self-end'>
                                <button className='btn SaveBtn mt-3 text-light' style={{backgroundColor: "purple"}}>Save</button>
                            </div>
                        </form>                    
                    </div>
                </div>
            </div>
        </> 
    );
}

export default SetProfilePic;