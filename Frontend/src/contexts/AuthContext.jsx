import { createContext, useEffect, useState } from "react";
import { API } from '../api/axios.js';

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
    const [user, setUser]=useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
        const fetchCurrentUser= async ()=>{
            try{
                const res= await API.get('/users/current-user');
                setUser(res.data.data);
            }catch(error){
                setUser(null);
        }finally{
            setIsLoading(false);
        }
       }

       fetchCurrentUser();
    },[])

    return (
        <AuthContext.Provider value={{user, setUser, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
};