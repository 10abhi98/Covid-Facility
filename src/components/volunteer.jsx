// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";

class Volunteer extends Component {
    render() {
        return (
            <div id='voluntee' className='container-fluid'>
                <div className='row ml-sm-5'>
                    <div className='col-sm-5 pl-sm-5'>
                        <h2>Hi,</h2>
                        <p>
                            We are volunteering to provide near-real time
                            information about the availability of Covid-supplies
                            to patients in Delhi,India.
                        </p>
                        <div>
                            Helping is easy
                            <ol style = {{marginLeft : '20px'}}>
                                <li>Log In</li>
                                <li>Make a Quick Call</li>
                                <li>Log Out</li>
                            </ol>
                        </div>
                        <p>
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
                                Log In
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
                </div>
            </div>
        );
    }
}

export default Volunteer;
