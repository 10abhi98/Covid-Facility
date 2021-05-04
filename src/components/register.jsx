// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";
import google from "../images/Google.png";

class Register extends Component {
	render() {
		return (
            <>
				<div id='loginPlace' className='float-right'>
					<button id='logIn' className="button">Log In</button>
				</div>
				<div id='register' className='container-fluid'>
					<div className='row ml-md-5'>
						<div className='col-md-5 pl-md-5'>
							<h2>Welcome to the team</h2>
							<h6>Signing up...We just need a bit of information about you</h6>
							<form>
								<div className='form-group'>
									<input type='text' className='form-control' placeholder='Name' />
								</div>
								<div className='form-group'>
									<input type='email' className='form-control' placeholder='Email ID' />
								</div>
								<div className='form-group'>
									<input type='password' className='form-control' placeholder='Password' />
								</div>
								<div className='form-group'>
									<input type='number' className='form-control' placeholder='Contact (optional)' />
								</div>
								<button id='signUp' type='submit' className='button'>Sign Up</button>
							</form>
							<br /><br />
							<h6>or you can simply Signup with your Google account</h6>
							<button id='gog' type='button' className='btn shadow-sm bg-white'>
								<img src={google} alt='Google' />
								<span>
									Sign In with Google
                            	</span>
							</button>
						</div>
					</div>
				</div>
			</>
    	);
  	}
}

export default Register;
