import React, { useEffect , useContext , useState} from "react";
import { UserContext } from "../../context/userContext";
import { useRouter } from "next/router";
import {toast} from 'react-toastify';
import axios from 'axios';
const Users = () => {
    const [ userState ] = useContext(UserContext);
    const router = useRouter();
    const [ users , setUsers ] = useState([]);

    useEffect( ()=> {
        if(!(userState && userState.user && userState.token)){
            router.push("/");
        }
        if(!(userState && userState.user.role == "Admin")){
            router.push("/UserDash");
        }
        fetchUsers();
    } , [userState]);

    const fetchUsers = () => {
        axios.get("http://localhost:4000/user/AllUsers").then(data => {
            setUsers(data.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleDelete = ( userId ) => {
        if(userId == userState.user._id){
            toast.error("You can't delete Admin");
            return;
        }
        axios.delete("http://localhost:4000/user/deleteUser/"+userId).then(data => {
            toast(data.data);
            fetchUsers();
        }).catch( err => {
            toast.error(err);
        });
    }

    return (
        <>
            <div className="UsersManageBox container" style={{height: "88vh"}}>
                <div className="UsersManageOuterBox">
                    <div className="UsersManageInnerBox">
                        <div className="UsersTitleBox">
                            <h4>Manage All Users of the Application</h4>
                        </div>
                        <div className="AllUsersBox">
                            <div className="AllUsersTableBox">
                            <table className="table table-striped table-responsive  table-bordered table-hover" style={{textAlign: "center"}}>
                                <thead>
                                <tr className="text-light " style={{backgroundColor: "purple"}}>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Role</th>
                                    <th>Profile Picture</th>
                                    <th>Delete</th>
                                </tr>
                                </thead>
                                    <tbody>
                                        {
                                            users ? (
                                                users.map( user => {
                                                    return (
                                                        <tr key={user._id} className="" style={{backgroundColor: "#f1c40f"}}>
                                                            <td>{user.name}</td>
                                                            <td>{user.email}</td>
                                                            <td>{user.phoneNumber}</td>
                                                            <td>{user.role}</td>  
                                                            <td>{user.image ? <img src={user.image.url} alt="image not loaded" width="30px"></img> : "No Image"}</td>
                                                            <td onClick={ () => { handleDelete(user._id)}} style={{cursor: "pointer" , textAlign: "center"}}><img  width="25px"src="./../images/Delete_96px_2.png"></img></td>
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
                                                    <td>none</td>  
                                                    <td style={{cursor: "pointer" , textAlign: "center"}}><img  width="25px"src="./../images/Delete_96px_2.png"></img></td>
                                                    <td style={{cursor: "pointer" , textAlign: "center"}}><img width="25px"src="./../images/Edit User Male_96px.png"></img></td>                      
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

export default Users;