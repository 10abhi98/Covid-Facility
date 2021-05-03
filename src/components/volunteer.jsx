// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";
import google from "../images/Google.png";

class Volunteer extends Component {
  render() {
    return (
      <div id="voluntee" className="container-fluid">
        <div className="row ml-md-5">
          <div className="col-md-5 pl-md-5">
            <h2>Hi,</h2>
            <p>
              We are volunteering to provide near-real time information about
              the availability of Covid-supplies to patients in Delhi,India.
            </p>
            <p>
              Helping is easy
              <ol>
                <li>Log In</li>
                <li>Make a Quick Call</li>
                <li>Log Out</li>
              </ol>
            </p>
            <p>
              Help anytime, anywhere.
              <br />
              Join our team!
            </p>
            <span>
              <button
                id="logIn"
                className="button mr-2"
                onClick={() => this.props.history.push("/login")}
              >
                Log In
              </button>
              <button
                id="signUp"
                type="submit"
                className="button ml-2"
                onClick={() => this.props.history.push("/volunteer/register")}
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
