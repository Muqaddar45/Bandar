import React , {useContext, useEffect, useState} from 'react';
import NextLink from 'next/link';
import { UserContext } from '../context/userContext';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [userState , setUserState ] = useContext(UserContext);
  const router= useRouter();
  // console.log(userState.user);
  //logout current user
  const logout = () => {
    setUserState(undefined);
    window.localStorage.removeItem("user");
    router.push("/");
  }
  //router pathname
  const [currentPathName  , setCurrentPathName ] = useState(router.pathname);
  //Checking current path
  useEffect( () => {
    setCurrentPathName(router.pathname);
  } , [router.pathname]);
  return (
    <>
        <div className='navbarBox container'>
            <nav className="navbar navbar-expand-sm b-light navbar-light d-flex justify-content-between">

               { userState && userState.token ? (
                <NextLink href={`/UserProfile/${userState.user._id}`}><a className="nav-link">
                  {
                    userState.user.image && userState.user.image.url ? (
                    <img src={userState.user.image.url} alt="Image Not found" className='Logo rounded-circle' style={{width: "30px" , height: "30px"}}></img>
                  ): (
                    <span className='p-1 px-2 bg-light rounded-circle' style={{border:"3px solid purple" , fontWeight: 'bold' , color: "purple" , width: "30px" , height: "30px"}}>{userState.user.name.charAt(0)}</span>
                  )}
                    
                </a></NextLink>
               ): (
                <NextLink href="/UserDash"><a className="nav-link"><img src='images/Logo.png' className='Logo' style={{width: "60px"}}></img></a></NextLink>
               )}
                
                {
                    userState && userState.token ?  (
                        <div className='navbar-brand flex-grow-1 mx-2'>
                            <span>{userState.user.name}</span>
                        </div>
                    ): 
                    ""
                }
                

                <ul className="navbar-nav">     
                        {
                            userState && userState.user ? (
                              <>
                                <li className="navItemNavbar mx-4 nav-item" style={{cursor: "pointer"}}>
                                  <NextLink href="/UserDash">
                                    <a className="nav-link ">Home</a>
                                  </NextLink>
                                </li>
                                {
                                  (userState && userState.user && userState.token && userState.user.role=="Admin") ? (
                                    <li className="nav-item navItemNavbar mx-4" style={{cursor: "pointer"}}>
                                      <NextLink href="/AdminDash" ><a className="nav-link">Admin Dashboard</a></NextLink>
                                    </li>
                                  ) : ""
                                }
                                <li className="navItemNavbar mx-4 nav-item" style={{cursor: "pointer"}}>
                                    <a className="nav-link " onClick={logout}>Logout</a>
                                </li>
                              </>
                            ) : ( 
                                <li className="nav-item navItemNavbar mx-4">
                                    {
                                        currentPathName == "/Register" ? 
                                            (   
                                                <NextLink href="/"><a className="nav-link">Login</a></NextLink> 
                                            ) : 
                                            (
                                                
                                                <NextLink href="/Register"><a className="nav-link">Sign Up</a></NextLink>
                                                
                                            )
                                    }
                                    
                                </ li>
          
                            )
                        }
                        
                    </ul>
            </nav>
        </div>
    </>
  );
}
export default Navbar;