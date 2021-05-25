// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";
import AuthContext from "../services/AuthContext";
import ResetPassword from "./resetpassword";
import { getUserRole } from "../services/FirebaseHandler";
import { toast } from '../scripts/script';
import google from "../images/Google.png";
import volunteerDesktop from "../images/volunteer_desktop.png";
import volunteerMobile from "../images/volunteer_mobile.png";

class Login extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
            userPassword: '',
            emailError: '',
            passError: '',
            resetMsg: '',
            loading: false,
            modal: false,
        };
        // Bind Functions ->
        this.clearError = this.clearError.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
        this.errorHandler = this.errorHandler.bind(this);
        this.logInWithEmailHandler = this.logInWithEmailHandler.bind(this);
        this.logInWithGoogleHandler = this.logInWithGoogleHandler.bind(this);
        this.resetPasswordModal = this.resetPasswordModal.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.snackbar = this.snackbar.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    // Clear Errors ->
    clearError() {
        this.setState({
            passError: '',
            emailError: '',
        });
    }

    // Clear Inputs ->
    clearInputs() {
        this.setState({
            userEmail: '',
            userPassword: '',
        });
    }

    // Error Handler ->
    errorHandler(err) {
        switch (err.code) {
            case 'auth/invalid-email':
            case 'auth/user-disabled':
            case 'auth/user-not-found':
                this.setState({
                    emailError: err.message,
                });
                break;
            case 'auth/wrong-password':
                this.setState({
                    passError: err.message,
                });
                break;
            default:
        }
    }

    // Prevent Memeory Leak ->
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }

    // User login with Email ->
    async logInWithEmailHandler(e) {
        e.preventDefault();
        const { logInWithEmail } = this.context;
        try {
            this.clearError();
            this.setState({ loading: true });
            const res = await logInWithEmail(
                this.state.userEmail,
                this.state.userPassword
            );
            const role = await getUserRole(res.user.uid);
            this.clearInputs();
            const path = role.includes('ADMIN') ? 'admin' : 'dashboard';
            this.props.history.push('/volunteer/' + path);
        } catch (err) {
            this.errorHandler(err);
        }
        this.setState({ loading: false });
    }

    // User login with Google ->
    async logInWithGoogleHandler(e) {
        e.preventDefault();
        const { signUpWithGoogle } = this.context;
        try {
            this.clearError();
            await signUpWithGoogle();
            this.clearInputs();
            this.props.history.push('/volunteer/dashboard');
            this.setState({ loading: false });
        } catch (err) {
            this.errorHandler(err);
            this.setState({ loading: false });
        }
    }

    // Reset Password Modal ->
    resetPasswordModal() {
        this.setState({
            modal: true,
        });
    }

    // Close Modal Callback function ->
    onModalClose = (stateVal, msg) => {
        this.setState({
            modal: stateVal,
            resetMsg: msg,
        });
        if (msg) this.snackbar();
    };

    // Snackbar Function ->
    snackbar() {
        toast();
    }

    // On Change Event Handler ->
    onChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    render() {
        return (
            <>
                <div id='signUpPlace' className='float-right'>
                    <button
                        id='primaryButton'
                        className='button'
                        onClick={() =>
                            this.props.history.push('/volunteer/register')
                        }
                    >
                        Sign Up
                    </button>
                </div>
                {/* Snackbar */}
                <div id='snackBar' style={{ right: '10px', marginLeft: '-125px' }}>{this.state.resetMsg}</div>
                <div id='register' className='container-fluid'>
                    <div className='volunteerMessage'>
                        <div className='order1 volunteerImage mobileOnly'>
                            <img src={volunteerMobile} alt='Google' />
                        </div>
                        <div className='messageDesktop'>
                            <div className='message'>
                                <h2>Welcome Back</h2>
                                <p className='padbL'>Just a moment</p>
                                <form>
                                    {/* Email ID */}
                                    <div className='form-group'>
                                        <input
                                            type='email'
                                            name='userEmail'
                                            className='form-control'
                                            placeholder='Email ID'
                                            required
                                            onChange={this.onChangeHandler}
                                        />
                                    </div>
                                    <small className='form-text'>
                                        {this.state.emailError}
                                    </small>
                                    {/* Passowrd */}
                                    <div className='form-group'>
                                        <input
                                            type='password'
                                            name='userPassword'
                                            className='form-control'
                                            placeholder='Password'
                                            disabled={this.state.loading}
                                            onChange={this.onChangeHandler}
                                        />
                                    </div>
                                    <small className='form-text'>
                                        {this.state.passError}
                                    </small>
                                    {/* Regular Login Button */}
                                    <div className='loginAndForgot padtL'>
                                        <div>
                                            <button
                                                id='primaryButton'
                                                type='submit'
                                                className='button'
                                                disabled={this.state.loading}
                                                onClick={this.logInWithEmailHandler}
                                            >
                                                {this.state.loading && (
                                                    <i className='fad fa-circle-notch fa-spin'></i>
                                                )}
                                            Login
                                        </button>
                                        </div>
                                        {/* Google Login Button In Mobile View */}
                                        <div>
                                            <button
                                                id='imageButton'
                                                type='button'
                                                className='mobileOnly btn'
                                                disabled={this.state.loading}
                                                onClick={
                                                    this.logInWithGoogleHandler
                                                }
                                            >
                                                <img src={google} alt='Google' />
                                                <span>Login with Google</span>
                                            </button>
                                        </div>
                                        <div className='desktopOnly'>
                                            {/* Reset Password Button */}
                                            <button
                                                id='textButton'
                                                onClick={this.resetPasswordModal}
                                            >
                                                Forgot Password?
                                </button>
                                            {this.state.modal && (
                                                <ResetPassword
                                                    modalState={this.onModalClose}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </form>
                                <div className='mobileOnly'>
                                    {/* Reset Password Button */}
                                    <button
                                        id='textButton'
                                        onClick={this.resetPasswordModal}
                                    >
                                        Forgot Password?
                                </button>
                                    {this.state.modal && (
                                        <ResetPassword
                                            modalState={this.onModalClose}
                                        />
                                    )}
                                </div>
                                <div className='desktopOnly padtL'>
                                    <p className='padbL padtL'>
                                        Or you can Login with your Google account
                                </p>
                                    {/* Google Login Button (Desktop View) */}
                                    <button
                                        id='imageButton'
                                        type='button'
                                        className='btn'
                                        onClick={this.logInWithGoogleHandler}
                                    >
                                        <img src={google} alt='Google' />
                                        <span>Login with Google</span>
                                    </button>
                                </div>
                            </div>
                            <div className='order2 desktopOnly volunteerImage'>
                                <img src={volunteerDesktop} alt='Google' />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Login;
