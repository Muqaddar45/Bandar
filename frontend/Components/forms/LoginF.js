import React, { useState , useContext , useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import { toast } from 'react-toastify';
import {useRouter} from 'next/router';

const LoginF = () => {
    //user context getting
    const [userState , setUserState ] = useContext(UserContext);

    useEffect (() => {
        if(userState && userState.token){
            router.push("/UserDash");
        }
    } , [userState]);
    //router 
    const router = useRouter();

    ///user data hooks
    const [user , setUser ] = useState({
        email:"",
        password: ""
    });
    let name , value;
    const getData = (e) => {
        name = e.target.name;
        value = e.target.value;
        setUser({...user , [name]: value});
    }

    const updatingData = (data) => {
        setUserState(data);
        window.localStorage.setItem("user" , JSON.stringify(data));
    }

    const checkLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:4000/user/login' , user).then( data => {
            toast.success("Login Successful");
            setUserState(data.data);
            window.localStorage.setItem("user" , JSON.stringify(data.data));
            updatingData(data.data);
            router.push("/UserDash");
        }).catch(err => { 
           if(err.response)
           toast.error(err.response.data);
        });
    }
    
    return (
        <>
            <div className='LoginOuterBox px-4'>
                <div className='LoginInnerBox'>
                    <div className='LoginTitleBox'>
                        <h3 className='LoginTitle'>Login To Your Account</h3>
                    </div>
                    <div className='LoginFormBox my-4'>
                        <form className='LoginForm form' onSubmit={checkLogin}>
                            <div className='emailInputBox form-group mt-5 my-4'>
                                <input required value={user.email} onChange={getData} type="email" placeholder="Enter Your Email" name="email" className="inputEmail text-light form-control"/>
                            </div>
                            <div className='passwordInputBox form-group my-4'>
                                <input required value={user.password} onChange={getData} type="password" placeholder="Enter Your Password" name="password" className="inputPassword text-light form-control"/>
                            </div>
                            <div className='btnBoxLogin form-group my-4'>
                                <button className='btn btnLogin'>Login</button>
                            </div>
                            <div>
                                <a href='/Register'  className='createNewAccountLogin'>Create new Account</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginF;