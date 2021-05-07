// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";
import google from "../images/Google.png";
import AuthContext from "../models/AuthContext";

class Register extends Component {
    // Access Context Values
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userEmail: "",
            userPassword: "",
            userContact: null,
            emailError: "",
            passError: "",
            loading: false,
        };

        // Bind Functions ->
        this.clearError = this.clearError.bind(this)
        this.clearInputs = this.clearInputs.bind(this)
        this.errorHandler = this.errorHandler.bind(this)
        this.signUpWithGoogleHandler = this.signUpWithGoogleHandler.bind(this);
        this.signUpWithEmailHandler = this.signUpWithEmailHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    // Clear Errors ->
    clearError() {
        this.setState({
            passError: "",
            emailError: "",
        });
    }

    // Clear Inputs ->
    clearInputs(){
        this.setState({
            userName: "",
            userEmail: "",
            userPassword: "",
            userContact: "",
        })
    }

    // Error Handler ->
    errorHandler(err){
        switch (err.code) {
            case "auth/email-already-in-use":
            case "auth/invalid-email":
                this.setState({
                    emailError: err.message,
                });
                break;
            case "auth/weak-password":
                this.setState({
                    passError: err.message,
                });
                break;
            default:
        }
    }

    // User sign up With Email ->
    async signUpWithEmailHandler(e) {
        e.preventDefault();
        const { signUpWithEmail } = this.context;
        try {
            this.clearError();
            this.setState({ loading: true });
            await signUpWithEmail(
                this.state.userName,
                this.state.userEmail,
                this.state.userPassword,
                this.state.userContact
            );
            this.clearInputs();
            this.props.history.push("/volunteer/dashboard");
        } catch (err) {
            this.errorHandler(err);
        }
        this.setState({ loading: false });
    }

    // User sign up with Google ->
    async signUpWithGoogleHandler(e) {
    	e.preventDefault();
        const { signUpWithGoogle } = this.context;
    	try {
            this.clearError();
    		await signUpWithGoogle();
            this.clearInputs();
            this.props.history.push("/volunteer/dashboard");
    	} catch (err) {
    		this.errorHandler(err);
    	}
        this.setState({ loading: false });
    }

    // Change Event Handler ->
    onChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    render() {
        return (
            <>
                <div id="loginPlace" className="float-right">
                    <button
                        id="logIn"
                        className="button"
                        onClick={() =>
                            this.props.history.push("/volunteer/login")
                        }
                    >
                        Log In
                    </button>
                </div>
                <div id="register" className="container-fluid">
                    <div className="row ml-md-5">
                        <div className="col-md-5 pl-md-5">
                            <h2>Welcome to the team</h2>
                            <h6>
                                Signing up...We just need a bit of information
                                about you
                            </h6>
                            <form>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="userName"
                                        className="form-control"
                                        placeholder="Name"
                                        required
                                        onChange={this.onChangeHandler}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="userEmail"
                                        className="form-control"
                                        placeholder="Email ID"
                                        required
                                        onChange={this.onChangeHandler}
                                    />
                                </div>
                                <small className="form-text">
                                    {this.state.emailError}
                                </small>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="userPassword"
                                        className="form-control"
                                        placeholder="Password"
                                        required
                                        onChange={this.onChangeHandler}
                                    />
                                </div>
                                <small className="form-text">
                                    {this.state.passError}
                                </small>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        name="userContact"
                                        className="form-control"
                                        placeholder="Contact (optional)"
                                        required
                                        onChange={this.onChangeHandler}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-sm-4 col-4">
                                        <button
                                            id="signUp"
                                            type="submit"
                                            className="button"
                                            disabled={this.state.loading}
                                            onClick={this.signUpWithEmailHandler}
                                            style={{ marginTop: "7px" }}
                                        >
                                            {this.state.loading && (<i className="fad fa-circle-notch fa-spin"></i>)}
                                            Sign Up
                                        </button>
                                    </div>
                                    {/* Google Button Display on mobile View */}
                                    <div className="col-8">
                                        <button
                                            id="gog-mob"
                                            type="button"
                                            className="btn shadow-sm bg-white"
                                            disabled={this.state.loading}
                                            onClick={this.signUpWithGoogleHandler}
                                        >
                                            <img src={google} alt="Google" />
                                            <span>Sign Up with Google</span>
                                        </button>
                                    </div>
                                    {/* End Display of Google Button on mobile View */}
                                </div>
                            </form>
                            <br />
                            <br />
                            <div id="deskView">
                                <h6>
                                    Or you can simply Signup with your Google
                                    account
                                </h6>
                                <button
                                    id="gog"
                                    type="button"
                                    className="btn shadow-sm bg-white"
                                    disabled={this.state.loading}
                                    onClick={this.signUpWithGoogleHandler}
                                >
                                    <img src={google} alt="Google" />
                                    <span>Sign Up with Google</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Register;
