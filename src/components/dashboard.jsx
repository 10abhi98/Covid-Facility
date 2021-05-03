// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let hospitals = ["Ganga Ram Hospital", "Medicare Pharmacy"];
    let hospitalQuestionarre = {
      Beds: "How many beds are available?",
      Oxygen: "How much Oxygen is available?",
      "New Patients": "How many New Patients were admitted in the last hour?",
      "Waiting Patients": "How many patients are waiting outside?",
      Remidisivir: "How much Remidisivir is available?",
    };

    return (
      <div className="container-fluid">
        <div id="dashboard" className="row ml-md-5">
          <div className="col-md-5 pl-md-5">
            <h2>Welcome Nirbhay!</h2>
            <p>Pick a task.</p>
            <p className="volunteerTasks">Quick tasks (2-3 mins each)</p>
            {hospitals.map((hospital, index) => (
              <button id="hospitalBtn" type="button" className="btn btn-light">
                {index + 1}. Call {hospital}
              </button>
            ))}
            <p className="volunteerTasks">
              Slightly Longer tasks (10-15 mins each)
            </p>
            {hospitals.map((hospital, index) => (
              <button id="hospitalBtn" type="button" className="btn btn-light">
                {index + 1}. Call {hospital}
              </button>
            ))}
            <p className="volunteerTasks">
              'I have some time' tasks (45-60 mins each)
            </p>
            {hospitals.map((hospital, index) => (
              <button
                id="hospitalActiveBtn"
                type="button"
                className="btn btn-light"
              >
                {index + 1}. Call {hospital}
              </button>
            ))}
          </div>

          <div id="hospitalForm" className="col-md-6 pl-md-5">
            <h3 style={{ fontSize: "30px" }}>Ganga Ram Hospital!</h3>
            <p>Pick a task.</p>
            <p className="volunteerTasks"></p>
            <form id="taskList">
              {Object.entries(hospitalQuestionarre).map((value) => (
                <div className="form-group" style={{ marginBottom: "5px" }}>
                  <label style={{ fontSize: "14px", marginBottom: "0px" }}>
                    {value[1]}
                  </label>
                  <input
                    type="number"
                    style={{ fontSize: "14px", marginBottom: "0px" }}
                    className="form-control"
                    placeholder={value[0]}
                  />
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
