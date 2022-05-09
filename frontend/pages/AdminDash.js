import React, { useEffect , useContext , useState} from "react";
import { UserContext } from "../context/userContext";
import { useRouter } from "next/router";
import NextLink from 'next/link';
const AdminDash = () => {
    const [ userState ] = useContext(UserContext);
    const router = useRouter();
    useEffect( ()=> {
        if(!(userState && userState.user && userState.token)){
            router.push("/");
        }
        if(!(userState && userState.user.role == "Admin")){
            router.push("/UserDash");
        }
    } , [userState]);

    return (
        <>
            <div className="AdminDashboardBox container mt-2" style={{height: "88vh"}}>
                <h3>{userState ? userState.user.name+ " Your Dashboard": ""} </h3>
                <div className="ManipulateBox d-flex justify-content-around" style={{marginTop: "20px"}}>
                    <div className="ManipulateUsersBox">
                       <NextLink href="/Admin/Users">
                        <button className="btn btn-warning d-flex justify-content-around" style={{width: "200px"}}>
                            <span style={{fontWeight: "bold" , color: "purple"  }}>Edit Users</span>
                            <img width="40px" src="./images/User Groups_104px.png" alt="editUserImageNotFound"></img>
                        </button>
                       </NextLink>
                    </div>
                    <div className="ManipulatePostsBox">
                      <NextLink href="/Admin/Posts">
                        <button className="btn btn-warning d-flex justify-content-around" style={{width: "200px"}}>
                            <span style={{fontWeight: "bold" , color: "purple"  }}>Edit Posts</span>
                            <img width="40px" src="./images/New Post_52px_1.png" alt="editUserImageNotFound"></img>
                        </button>
                      </NextLink>
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default AdminDash;