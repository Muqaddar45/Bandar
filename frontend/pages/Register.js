import React, { useEffect , useContext } from 'react';
import RegisterF from '../Components/forms/RegisterF';
import { UserContext } from '../context/userContext';
import { useRouter } from 'next/router';

const SignUp = () => {
    const [userState , setUserState ] = useContext(UserContext);
    const router = useRouter();
    useEffect( () => {
        if(userState && userState.token){
            router.push("/");
        }
    } , []);
    return (
        <>
        
            <div className='SignUpOuterBox container'>
                <div className='SignUpInnerBox'>
                    <div className='SignUpFormBox d-flex justify-content-center'>
                        <RegisterF
                            //Props
                        ></RegisterF>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUp;