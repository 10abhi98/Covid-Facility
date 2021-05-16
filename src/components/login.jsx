// Libraries ->
import React, { Component } from 'react';
import '../styles/style.css';
import google from '../images/Google.png';
import AuthContext from '../services/AuthContext';
import ResetPassword from './resetpassword';
import { getUserRole } from '../services/FirebaseHandler';

class Login extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
            userPassword: '',
            emailError: '',
            passError: '',
            loading: false,
            modal: false,
        };
        // Bind Functions ->
        this.clearError = this.clearError.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
        this.errorHandler = this.errorHandler.bind(this);
        this.logInWithEmailHandler = this.logInWithEmailHandler.bind(this);
        this.logInWithGoogleHandler = this.logInWithGoogleHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.resetPasswordModal = this.resetPasswordModal.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
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
    onModalClose = (stateVal) => {
        this.setState({
            modal: stateVal,
        });
    };

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
                        id='signUp'
                        className='button'
                        onClick={() =>
                            this.props.history.push('/volunteer/register')
                        }
                    >
                        Sign Up
                    </button>
                </div>
                <div id='register' className='container-fluid'>
                    <div className='row ml-md-5'>
                        <div className='col-md-5 pl-md-5'>
                            <h2>Welcome Back</h2>
                            <h6>Just a moment</h6>
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
                                <div className='row'>
                                    <div className='col-sm-3 col-4'>
                                        <button
                                            id='logIn'
                                            type='submit'
                                            className='button'
                                            disabled={this.state.loading}
                                            onClick={this.logInWithEmailHandler}
                                            style={{ marginTop: '7px' }}
                                        >
                                            {this.state.loading && (
                                                <i className='fad fa-circle-notch fa-spin'></i>
                                            )}
                                            Log In
                                        </button>
                                    </div>
                                    {/* Google Login Button In Mobile View */}
                                    <div className='col-8'>
                                        <button
                                            id='gog-mob'
                                            type='button'
                                            className='btn shadow-sm bg-white'
                                            disabled={this.state.loading}
                                            onClick={
                                                this.logInWithGoogleHandler
                                            }
                                        >
                                            <img src={google} alt='Google' />
                                            <span>Log In with Google</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <div>
                                {/* Reset Password Button */}
                                <button
                                    className='resetPass'
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
                            <br />
                            <br />
                            <div id='deskView'>
                                <h6>
                                    Or you can Log In with your Google account
                                </h6>
                                {/* Google Login Button (Desktop View) */}
                                <button
                                    id='gog'
                                    type='button'
                                    className='btn shadow-sm bg-white'
                                    onClick={this.logInWithGoogleHandler}
                                >
                                    <img src={google} alt='Google' />
                                    <span>Log In with Google</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Login;
