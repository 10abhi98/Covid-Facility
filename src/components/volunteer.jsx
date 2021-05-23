// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";
import volunteerDesktop from "../images/volunteer_desktop.png";
import volunteerMobile from "../images/volunteer_mobile.png";

class Volunteer extends Component {
    render() {
        return (
            <div id='voluntee' className='container-fluid'>
                <div className='volunteerMessage'>
                    <div className='imageMobile'>
                        <img src={volunteerDesktop} alt='Google' />
                    </div>
                    <div className='messageDesktop'>
                        <div className='message'>
                            <h2 className='padb20'>Hi,</h2>
                            <p className='padb20'>
                                We are volunteering to provide near-real time
                                information about the availability of Covid-supplies
                                to patients in Delhi, India.
                        </p>
                            <div>
                                <p className='padb20'>Helping is easy
                            <ol>
                                        <li>Login</li>
                                        <li>Make a Quick Call</li>
                                        <li>Log Out</li>
                                    </ol></p>
                            </div>
                            <p className='padb20'>
                                Help anytime, anywhere.
                            <br />
                            Join our team!
                        </p>
                            <span>
                                {/* Login Button */}
                                <button
                                    id='logIn'
                                    className='button mr-2'
                                    onClick={() =>
                                        this.props.history.push("/volunteer/login")
                                    }
                                >
                                    Login
                            </button>
                                {/* Signup Button */}
                                <button
                                    id='signUp'
                                    type='submit'
                                    className='button ml-2'
                                    onClick={() =>
                                        this.props.history.push(
                                            "/volunteer/register"
                                        )
                                    }
                                >
                                    Sign Up
                            </button>
                            </span>
                        </div>
                        <div className='imageDesktop'>
                            <img src={volunteerDesktop} alt='Google' />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Volunteer;
