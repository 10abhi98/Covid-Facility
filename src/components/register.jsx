// Libraries ->
import React, { Component } from 'react';
import '../styles/style.css';
import google from '../images/Google.png';
import { auth, signInWithGoogle } from '../models/firebase';

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userName: '',
			userEmail: '',
			userPassword: '',
			userContact: '',
		};

		// Bind Functions ->
		this.signUpWithEmailAndPasswordHandler = this.signUpWithEmailAndPasswordHandler.bind(this);
		this.signUpWithGoogleHandler = this.signUpWithGoogleHandler.bind(this);
		this.onChangeHandler = this.onChangeHandler.bind(this);
	}
	async signUpWithEmailAndPasswordHandler(e, email, password) {
		console.log(e, email, password);
		e.preventDefault();
		try {
			await auth.createUserWithEmailAndPassword(email, password);
		} catch (error) {
			console.log(error);
		}
	}

	async signUpWithGoogleHandler(e, email, password) {
		console.log(e, email, password);

		e.preventDefault();

		try {
			signInWithGoogle();
			console.log('success');
			this.state({
				userName: '',
				userEmail: '',
				userPassword: '',
				userContact: '',
			});
		} catch (error) {
			console.log(error);
		}
	}

	// Change Event Handler ->
	onChangeHandler = (e) => {
		this.setState({
            [e.target.name]: e.target.value
        })
	}

	render() {
		return (
			<>
				<div id='loginPlace' className='float-right'>
					<button id='logIn' className='button' onClick={() => this.props.history.push("/volunteer/login")}>
						Log In
          			</button>
				</div>
				<div id='register' className='container-fluid'>
					<div className='row ml-md-5'>
						<div className='col-md-5 pl-md-5'>
							<h2>Welcome to the team</h2>
							<h6>Signing up...We just need a bit of information about you</h6>
							<form>
								<div className='form-group'>
									<input
										type='text'
										name='userName'
										className='form-control'
										placeholder='Name'
										required
										onChange={this.onChangeHandler}
									/>
								</div>
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
								<div className='form-group'>
									<input
										type='password'
										name='userPassword'
										className='form-control'
										placeholder='Password'
										required
										onChange={this.onChangeHandler}
									/>
								</div>
								<div className='form-group'>
									<input
										type='number'
										name='userContact'
										className='form-control'
										placeholder='Contact (optional)'
										required
										onChange={this.onChangeHandler}
									/>
								</div>
								<div className='row'>
									<div className='col-sm-3 col-4'>
										<button
											id='signUp'
											type='submit'
											className='button'
											onClick={(event) => {
												this.signUpWithEmailAndPasswordHandler(
													event,
													this.state.userEmail,
													this.state.userPassword
												);
											}}
											style = {{marginTop : '7px'}}
										>
											Sign Up
                						</button>
									</div>
									{/* Google Button Display on mobile View */}
									<div className='col-8'>
										<button
											id='gog-mob'
											type='button'
											className='btn shadow-sm bg-white'
											onClick={(event) => {
												this.signUpWithGoogleHandler(
													event,
													this.state.userEmail,
													this.state.userPassword
												);
											}}
										>
											<img src={google} alt='Google' />
											<span>Sign Up with Google</span>
										</button>
									</div>
									{/* End Display of Google Button on mobile View */}
								</div>
							</form>
							<br />
							<br />
							<div id = 'deskView'>
								<h6>Or you can simply Signup with your Google account</h6>
								<button
									id='gog'
									type='button'
									className='btn shadow-sm bg-white'
									onClick={(event) => {
										this.signUpWithGoogleHandler(
											event,
											this.state.userEmail,
											this.state.userPassword
										);
									}}
								>
									<img src={google} alt='Google' />
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
