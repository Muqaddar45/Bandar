import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {useRouter} from 'next/router';


const RegisterF = (props) => {

    //user form data hook
    const [user , setUser ] = useState({
        name: "", email: "", phoneNumber: "", password: ""
    });
    const [passwordC , setPasswordC ] = useState("");
    //Btn loading hook
    const [ loading , setLoading ] = useState(false);
    
    //hook for user submit checking
    const [ok , setOk ] = useState(false);

    //router for routing
    const router = useRouter();

    let name , value;
    const userChange = (e) => {
        name = e.target.name;
        value = e.target.value;
        setUser({...user , [name]:value});
    }

    const userChangePasswordC = (e) => {
        setPasswordC(e.target.value);
    }

    const dataSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        axios.post("http://localhost:4000/user/register" ,
        user
        ).then(data => {
            toast.success("Account is created Successfully");
            setUser({name: "" , email: "" , phoneNumber: "" , password: ""});
            setPasswordC("");
            setLoading(false);
            console.log(data.data);
            router.push(`/SetProfilePic/${data.data._id}`);
        }).catch(err => {
            setLoading(false); 
            toast.error(err.response.data);
        });
    }
    return (
        <>
            <div className='formBoxSignup w-50'>
                <div className='RegisterTitleBox'>
                    <h4 className='RegisterTitle'>Create New Account</h4>
                </div>
                <div className='RegisterFormBox'>
                    <form className='RegisterForm' onSubmit={dataSubmit}>
                        <div className='inputNameBox form-group'>
                            <input value={user.name} onChange={userChange} type="text" required placeholder="Enter Your Name" name='name' className='inputName text-light my-4 form-control' />
                        </div>
                        <div className='inputEmailBox form-group'>
                            <input value={user.email} onChange={userChange} type="email" required placeholder="Enter Your Email" name='email' className='inputEmail text-light my-4 form-control' />
                        </div>
                        <div className='inputPhoneNumberBox form-group'>
                            <input value={user.phoneNumber} onChange={userChange} required type="number" placeholder="Enter Your Phone Number" name='phoneNumber' className='inputPhoneNumber text-light my-4 form-control' />
                        </div>
                        <div className='inputPasswordBox form-group'>
                            <input value={user.password} onChange={userChange} required type="password" placeholder="Enter Your Password" name='password' className='inputPassword text-light my-4 form-control' />
                        </div>
                        <div className='inputPasswordCBox form-group'>
                            <input value={passwordC} onChange={userChangePasswordC} required type="password" placeholder="Confirm Your Password" name='passwordC' className='inputPasswordC text-light my-4 form-control' />
                        </div>
                        <div className='inputSubmitBtnBox form-group'>
                            <button className='SubmitBtn btn' type='submit'>{loading ? <span><div className='spinner-border spinner-border-sm'></div></span>:"Save"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default RegisterF;