import React , { useState , useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import LoginF from './../Components/forms/LoginF';
import { useRouter } from 'next/router';



const Home = () => {
    const [userState , setUserState ] = useContext(UserContext);
    const router = useRouter();
    useEffect ( ()=> {
        if(useState && useState.token){
            router.push("/UserDash");
        }
    } , [useState]);
    return (
        <>
            <div className='homeOuterBox container'>
                <div className='homeInnerBox row'>
                    <div className='homeTitleBox col-6'>
                        <div className='homeTitleInnerBox'>
                            <div className='homeTitleTitle'>
                                <h1 className='indexPageTitleB'>B<span className='indexPageTitleNor'>ANDAR</span></h1>
                            </div>
                            <div className='titleDescriptionBox'>
                                <p className='titleDescription'>The first Afghani platform where users can share their ides's, memory, queries and etc.</p>
                            </div>
                        </div>
                    </div>
                    <div className='HomeLoginBox col-6'>
                        <LoginF></LoginF>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;