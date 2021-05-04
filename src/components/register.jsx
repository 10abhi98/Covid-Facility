// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";
import google from "../images/Google.png";
import { auth, signInWithGoogle } from "../models/firebase";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      contact: "",
    };
  }
  async signUpWithEmailAndPasswordHandler(e, email, password) {
    console.log(e, email, password);
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  }

  async signUpWithGoogleHandler(e, email, password) {
    console.log(e, email, password);

    e.preventDefault();

    try {
      signInWithGoogle();
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  }

  onChangeHandler(e) {
    const { name, value } = e.target;

    if (name === "userName") {
      this.setState({
        name: value,
      });
    } else if (name === "userEmail") {
      this.setState({
        email: value,
      });
    } else if (name === "userPassword") {
      this.setState({
        password: value,
      });
    } else if (name === "userContact") {
      this.setState({
        contact: value,
      });
    }
  }
  render() {
    return (
      <>
        <div id='loginPlace' className='float-right'>
          <button id='logIn' className='button'>
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
                    onChange={(event) => this.onChangeHandler(event)}
                  />
                </div>
                <div className='form-group'>
                  <input
                    type='email'
                    name='userEmail'
                    className='form-control'
                    placeholder='Email ID'
                    onChange={(event) => this.onChangeHandler(event)}
                  />
                </div>
                <div className='form-group'>
                  <input
                    type='password'
                    name='userPassword'
                    className='form-control'
                    placeholder='Password'
                    onChange={(event) => this.onChangeHandler(event)}
                  />
                </div>
                <div className='form-group'>
                  <input
                    type='number'
                    name='userContact'
                    className='form-control'
                    placeholder='Contact (optional)'
                    onChange={(event) => this.onChangeHandler(event)}
                  />
                </div>
                <button
                  id='signUp'
                  type='submit'
                  className='button'
                  onClick={(event) => {
                    this.signUpWithEmailAndPasswordHandler(
                      event,
                      this.state.email,
                      this.state.password
                    );
                  }}
                >
                  Sign Up
                </button>
              </form>
              <br />
              <br />
              <h6>or you can simply Signup with your Google account</h6>
              <button
                id='gog'
                type='button'
                className='btn shadow-sm bg-white'
                onClick={(event) => {
                  this.signUpWithGoogleHandler(
                    event,
                    this.state.email,
                    this.state.password
                  );
                }}
              >
                <img src={google} alt='Google' />
                <span>Sign In with Google</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Register;
