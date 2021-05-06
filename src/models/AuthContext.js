import React, {useState, useEffect, useContext} from 'react'
import {auth} from './firebase.js'

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthProvider = ({children}) =>{
    // Intially Set State ->
    const[loading, setLoading] = useState(true);
    const[currentUser, setCurrentUser] = useState(null);

    // Signup Function ->
    function signUp(name, email, password, contact = 0){
        auth.createUserWithEmailAndPassword(email,password).then((user) =>{
            console.log(user);
        });

        
    }
    
    // Check Active State of User ->
    useEffect(() =>{
        auth.onAuthStateChanged((user) =>{
            setCurrentUser(user);
            setLoading(false);
        })
    }, []);

    const value = {
        currentUser,
        signUp,
    }
    
    return (
        <AuthContext.Provider value={{ value }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
