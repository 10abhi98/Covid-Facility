import React, { Component } from "react";
import { auth } from "./firebase";
import { addData } from "./UserData";
import { provider } from "./firebase";

const AuthContext = React.createContext();

export class AuthProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            loading: true,
        };

        // Bind Functions ->
        this.authListener = this.authListener.bind(this);
        this.signUpWithEmail = this.signUpWithEmail.bind(this);
        this.signUpWithGoogle = this.signUpWithGoogle.bind(this);   // Same Method for Google LogIn/SignUp
        this.logInWithEmail = this.logInWithEmail.bind(this);
    }

    componentDidMount() {
        this.authListener();
    }

    // User signUp With Email & Password->
    signUpWithEmail(name, email, password, contact = null) {
        return auth
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
                const user = res.user;
                addData(user.uid, name, email, contact);
            });
    }

    // User Signup/Login with Google ->
    signUpWithGoogle(){
        return auth
            .signInWithPopup(provider)
            .then((res) => {
                const user = res.user;
                addData(user.uid, user.displayName, user.email, user.phoneNumber);
        });
    };

    // User login with Email & Password ->
    logInWithEmail(email,password){
        return auth.signInWithEmailAndPassword(email, password);
    }

    // User logout ->
    logout = () => {
        return auth.signOut();
    }

    // Authenticate user (to check if user is logged) ->
    authListener() {
        auth.onAuthStateChanged((user) => {
            this.setState({
                currentUser: user,
                loading: false,
            });
        });
    }
    render() {
        const { currentUser, loading } = this.state;
        const { signUpWithEmail, signUpWithGoogle, logInWithEmail, logInWithGoogle, logout } = this;
        return (
            <AuthContext.Provider
                value={{
                    currentUser,
                    loading,
                    signUpWithEmail,
                    signUpWithGoogle,
                    logInWithEmail,
                    logInWithGoogle,
                    logout
                }}
            >
                {!loading && this.props.children}
            </AuthContext.Provider>
        );
    }
}

export default AuthContext;
