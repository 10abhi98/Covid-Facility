// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";
import volunteerDesktop from "../images/volunteer_desktop.png";
// import volunteerMobile from "../images/volunteer_mobile.png";

class Volunteer extends Component {
    render() {
        return (
            <div id='voluntee' className='container-fluid'>
                <div className='volunteerMessage'>
                    <div className='order1 volunteerImage mobileOnly'>
                        <img src={volunteerDesktop} alt='Google' />
                    </div>
                    <div className='messageDesktop'>
                        <div className='message'>
                            <h2 className='padbL'>Hi,</h2>
                            <p className='padbL'>
                                We are volunteering to provide near-real time
                                information about the availability of Covid-supplies
                                to patients in Delhi, India.
                        </p>
                            <div>
                                <p className='padbL'>Helping is easy
                            <ol>
                                        <li>Login</li>
                                        <li>Make a Quick Call</li>
                                        <li>Log Out</li>
                                    </ol></p>
                            </div>
                            <p className='padbL'>
                                Help anytime, anywhere.
                            <br />
                            Join our team!
                        </p>
                            <div className='padtL'>
                                {/* Login Button */}
                                <button
                                    id='primaryButton'
                                    className='button mr-2'
                                    onClick={() =>
                                        this.props.history.push("/volunteer/login")
                                    }
                                >
                                    Login
                            </button>
                                {/* Signup Button */}
                                <button
                                    id='primaryButton'
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
                            </div>
                        </div>
                        <div className='order2 desktopOnly volunteerImage'>
                            <img src={volunteerDesktop} alt='Google' />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Volunteer;
