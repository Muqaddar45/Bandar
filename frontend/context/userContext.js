import React , {useState , createContext, useEffect} from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    useEffect(() => {
        setUserState(JSON.parse(window.localStorage.getItem("user")));
    } , []);
    const [userState , setUserState ] = useState({
        user: {},
        token:""
    });
    return (
        <UserContext.Provider value={[ userState , setUserState ]}>
            {children}
        </UserContext.Provider>
    );
}
export { UserContext , UserProvider };