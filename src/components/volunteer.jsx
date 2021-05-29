// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";
import volunteerDesktop from "../images/volunteer_desktop_2.png";
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
                            <h5 className='padbL'>
                                Come volunteer to provide real-time
                                information about Covid medical-supplies.
                        </h5>
                            <div>
                                <h5 className='padbL'>Helping is easy
                            <ol>
                                        <li>Login</li>
                                        <li>Make a Quick Call to find updated info</li>
                                        <li>Log Out</li>
                                    </ol></h5>
                            </div>
                            <h5 className=''>
                                Help anytime, anywhere.
                            <br />
                            <span style={{fontWeight:700}}>Lets help!</span>
                        </h5>
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
