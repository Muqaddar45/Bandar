import React from 'react';
import { UserProvider } from '../context/userContext';
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Components/Navbar';
import Head from 'next/head';
import './../style/index.css';
import './../style/Navbar.css';
import './../style/UserDash.css';

const myApp = ({Component , pageProps}) => {
    const head = () => {
        <Head>
            <meta name='viewport' content='width=device=width,initial-scale=1.0'></meta>
        </Head>
    }
    return (
        <>
        {head()}
        <div className='AllPagesBox'>  
         <UserProvider>
            <ToastContainer
            autoClose={3000}
            closeOnClick={true}
            pauseOnHover={false}
            rtl={false}
            ></ToastContainer>
            <Navbar></Navbar>
            <Component {...pageProps} className="AllPages"></Component>
            </UserProvider>
        </div>
        </>
    );
}

export default myApp;

