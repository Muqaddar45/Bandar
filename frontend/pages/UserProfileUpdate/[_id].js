import React, { useEffect , useContext , useState} from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfileUpdate = () => {
    
    const [ userState , setUserState ] = useContext(UserContext);
    const router = useRouter();

    const userId = router.query._id;

    const [user , setUser ] = useState({});
    const [NewData , setNewData ] = useState({
        name: "",
        email: "",
        phoneNumber:"",
    });
    const [loading , setLoading ] = useState(false);

    useEffect ( () => {
        if(! (userState && userState.token) ) {
            router.push("/");
        }
        axios.get("http://localhost:4000/user/getOneUser/"+userId).then( data => {
            setUser(data.data);
        }).catch( err => {
            toast.error(err);
        });
    } , [userId]);

    const dataChange = (e) => {
        let value , name;
        value = e.target.value;
        name = e.target.name;
        setUser({...user , [name]:value});
    } 

    const updateUser = (e) => {
        e.preventDefault();
        axios.put("http://localhost:4000/user/userProfile/"+userId , user).then(data => {
            toast.success("User Profile Updated");
            axios.get("http://localhost:4000/user/getOneUser/"+userId).then( data => {
            let UUser = JSON.parse(localStorage.getItem("user"));
            UUser.user = data.data;
            localStorage.setItem("user" , JSON.stringify(UUser));
            setUserState({...userState , user: data.data});
            router.back();
        }).catch( err => {
            toast.error(err);
        });

        }).catch(err => {
            toast.error("User profile isn't updated");
        });
        
    }
    

    return (
        <>
            <div className='formBoxUserProfileUpdateBox container' style={{height: "88vh"}}>
                <div className='UserProfileUpdateTitleBox'>
                    <h4 className='UserProfileUpdateTitle mx-2'>Update Your Profile</h4>
                </div>
                <div className='UserProfileUpdateFormBox d-flex justify-content-center'>
                     <form className='UserProfileUpdateForm bg-warning p-5 w-50' style={{borderRadius: "10px"}} onSubmit={updateUser}>
                        <div className='inputNameBox form-group'>
                            <input style={{color: "white" , marginTop: "20px"}} onChange={dataChange} value={(userState) ? user.name : ""}  type="text" required placeholder="Enter Your Name" name='name' className='inputName form-control' />
                        </div>
                        <div className='inputEmailBox form-group'>
                            <input style={{color: "white" , marginTop: "20px"}} onChange={dataChange} value={user.email}  type="email" required placeholder="Enter Your Email" name='email' className='inputEmail form-control' />
                        </div>
                        <div className='inputPhoneNumberBox form-group'>
                            <input style={{color: "white" , marginTop: "20px"}} onChange={dataChange} value={user.phoneNumber}  required type="number" placeholder="Enter Your Phone Number" name='phoneNumber' className='inputPhoneNumber form-control' />
                        </div>
                        <div className='inputSubmitBtnBox form-group'>
                            <button className='UpdateBtn btn' style={{backgroundColor: "purple" , color: "white" , marginTop: "20px" , float: "right"}} type='submit'>{loading ? <span><div className='spinner-border spinner-border-sm'></div></span>:"Update"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UserProfileUpdate;