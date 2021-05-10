import React, { Component } from "react";
import '../styles/style.css';
import AuthContext from '../services/AuthContext';
import $ from 'jquery';

export class Modal extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            resetEmail : '',
            emailError : '',
            loading : false
        }
    
        this.resetPasswordHandler = this.resetPasswordHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onCloseHandler = this.onCloseHandler.bind(this);
        this.clearError = this.clearError.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
    }

    componentDidMount(){
        $('#resetPasswordModal').modal({
            backdrop : 'static',
            keyboard : false
        });
        $('#resetPasswordModal').modal('show');
    }

    // Reset Password Handler ->
    async resetPasswordHandler(e) {
        e.preventDefault();
        const { resetPassword } = this.context;
        try {
            this.clearError();
            this.setState({loading : true})
            await resetPassword(this.state.resetEmail);
            this.clearInputs();
            $('#resetPasswordModal').modal('hide');
            this.props.modalState(false);
        } catch (err) {
            this.setState({emailError : err.message})
        }
        this.setState({ loading: false });
    }
    
    // On Change Event Handler ->
    onChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };
    
    // On Close Handler ->
    onCloseHandler (){
        this.props.modalState(false);
    }

    // Clear Errors ->
    clearError() {
        this.setState({
            emailError: '',
        });
    }

    // Clear Inputs ->
    clearInputs() {
        this.setState({
            resetEmail: '',
        });
    }

    render() {
        return (
            <>
                <div
                    className='modal fade'
                    id='resetPasswordModal'
                    aria-labelledby='exampleModalLabel'
                    aria-hidden='true'
                >
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <button
                                    type='button'
                                    className='close'
                                    data-dismiss='modal'
                                    aria-label='Close'
                                    onClick = {this.onCloseHandler}
                                >
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </div>
                            <div className='modal-body'>
                                <h3>RESET PASSWORD</h3><hr/><br/>
                                <form onSubmit={this.resetPasswordHandler}>
                                    <label>
                                        Enter your email address and we will send you a link to reset your password.
                                    </label>
                                    <div className='form-group'>
                                        <input
                                            name='resetEmail'
                                            type='email'
                                            className='form-control'
                                            placeholder='Enter your email'
                                            required
                                            onChange={this.onChangeHandler}
                                        />
                                    <small className='form-text' style = {{color : 'red'}}>
                                        {this.state.emailError}
                                    </small>
                                    </div>
                                    <div className = 'd-flex justify-content-center mt-3'>
                                        <button
                                            type='submit'
                                            className='btn btn-outline-primary btn-sm'
                                            disabled={this.state.loading}
                                        >
                                            Send Password Reset Email
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Modal;
