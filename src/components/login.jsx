import React, { Component } from 'react'
import '../styles/style.css';
import google from '../images/Google.png';
// import { auth, signInWithGoogle } from '../models/firebase';

class Login extends Component {
    render() {
        return (
            <>
                <div id='signUpPlace' className='float-right'>
					<button id='signUp' className='button' onClick={() => this.props.history.push("/volunteer/register")}>
						Sign Up
          			</button>
				</div>
				<div id='register' className='container-fluid'>
					<div className='row ml-md-5'>
						<div className='col-md-5 pl-md-5'>
							<h2>Welcome Back</h2>
							<h6>Just a moment</h6>
							<form>
								<div className='form-group'>
									<input
										type='email'
										name='userEmail'
										className='form-control'
										placeholder='Email ID'
                                        required
										// onChange={(event) => this.onChangeHandler(event)}
									/>
								</div>
								<div className='form-group'>
									<input
										type='password'
										name='userPassword'
										className='form-control'
										placeholder='Password'
                                        required
										// onChange={(event) => this.onChangeHandler(event)}
									/>
								</div>
								<div className='row'>
									<div className='col-sm-3 col-4'>
										<button
											id='logIn'
											type='submit'
											className='button'
                                            style = {{marginTop : '7px'}}
										>
											Log In
                						</button>
									</div>
									<div className='col-8'>
										<button
											id='gog-mob'
											type='button'
											className='btn shadow-sm bg-white'
										>
											<img src={google} alt='Google' />
											<span>Log In with Google</span>
										</button>
									</div>
								</div>
							</form>
							<br />
							<br />
							<div id = 'deskView'>
								<h6>Or you can Log In with your Google account</h6>
								<button
									id='gog'
									type='button'
									className='btn shadow-sm bg-white'
								>
									<img src={google} alt='Google' />
									<span>Log In with Google</span>
								</button>
							</div>
						</div>
					</div>
				</div>
            </>
        )
    }
}

export default Login