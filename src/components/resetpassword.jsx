import React, { Component } from "react";
import '../styles/style.css';
import AuthContext from '../services/AuthContext';
import $ from 'jquery';

export class Modal extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            resetEmail : ''
        }
    
        this.resetPasswordHandler = this.resetPasswordHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidUpdate(){
        $('#resetPasswordModal').modal(this.props.value)
    }

    componentWillUnmount(){
        
    }

    // Reset Password Handler ->
    async resetPasswordHandler() {
        const { resetPassword } = this.context;
        try {
            await resetPassword(this.state.resetEmail);
        } catch (err) {
            console.log(err.message);
        }
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
                <div
                    class='modal fade'
                    id='resetPasswordModal'
                    aria-labelledby='exampleModalLabel'
                    aria-hidden='true'
                >
                    <div class='modal-dialog modal-dialog-centered'>
                        <div class='modal-content'>
                            <div class='modal-header'>
                                <h5 class='modal-title' id='exampleModalLabel'>
                                    Reset Password
                                </h5>
                                <button
                                    type='button'
                                    class='close'
                                    data-dismiss='modal'
                                    aria-label='Close'
                                >
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </div>
                            <form>
                            <div class='modal-body'>
                                <input
                                    name='resetEmail'
                                    type='email'
                                    placeholder='Enter your email'
                                    onChange={this.onChangeHandler}
                                ></input>
                            </div>
                            </form>
                            <div class='modal-footer'>
                                <button
                                    type='button'
                                    class='btn btn-secondary'
                                    data-dismiss='modal'
                                >
                                    Close
                                </button>
                                <button
                                    type='button'
                                    class='btn btn-primary'
                                    onClick={this.resetPasswordHandler}
                                >
                                    Enter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Modal;
