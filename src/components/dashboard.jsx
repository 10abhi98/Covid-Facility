// Libraries ->
import React, { Component } from 'react';
import '../styles/style.css';

let smallTaskLocations = ['Ganga Ram Hospital', 'Medicare Pharmacy'];
let mediumTaskLocations = ['Shree Hospital', 'Dharamvir Pharmacy'];
let longTaskLocations = ['Sant Soham Hospital'];
let hospitalQuestionarre = {
  Beds: 'How many beds are available?',
  Oxygen: 'How much Oxygen is available?',
  'New Patients': 'How many New Patients were admitted in the last hour?',
  'Waiting Patients': 'How many patients are waiting outside?',
  Remidisivir: 'How much Remidisivir is available?',
};
let locationDetails = {
  name: [
    'Ganga Ram Hospital',
    'Medicare Pharmacy',
    'Shree Hospital',
    'Dharamvir Pharmacy',
    'Sant Soham Hospital',
  ],
  address: [
    'Jawahar Lal Nehru Marg,Delhi.110002',
    'Model Town',
    'Saket',
    'Rohini',
    'Sarita Vihar',
  ],
  contact: [9865341234, 7653412345, 8765432112, 9734501821, 7340501234],
  response: ['Quickly', 'Late', 'Quickly', 'Late', 'Quickly'],
};

let pharmacyQuestionarre = {
  Remidisivir: 'How much Remidisivir is available?',
};
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationName: smallTaskLocations[0],
      address: locationDetails['address'][0],
      contact: locationDetails['contact'][0],
      response: locationDetails['response'][0],
      activeBtn: smallTaskLocations[0],
    };
  }

  selectLocationHandler(e, location) {
    let index = locationDetails['name'].indexOf(location);

    this.setState({
      locationName: location,
      activeBtn: location,
      address: locationDetails['address'][index],
      contact: locationDetails['contact'][index],
      response: locationDetails['response'][index],
    });
  }

  submitInfoHandler(e) {
    e.preventDefault();

    console.log(e);
  }

  render() {
    return (
      <>
        <div id='loginPlace' className='float-right'>
          <button id='logIn' className='button'>
            Log In
          </button>
        </div>
        <div className='container-fluid'>
          <div id='dashboard' className='row ml-md-1'>
            <div className='col-md-4 pl-md-4'>
              <h2>Welcome Nirbhay!</h2>
              {this.state.activeBtn !== '' && <p>Pick a task.</p>}
              <p className='volunteerTasks'>Quick tasks (2-3 mins each)</p>
              {smallTaskLocations.map((location, index) => (
                <button
                  id={
                    location === this.state.activeBtn
                      ? 'locationActiveBtn'
                      : 'locationBtn'
                  }
                  type='button'
                  className='btn btn-light'
                  onClick={(e) => this.selectLocationHandler(e, location)}
                >
                  {index + 1}. Call {location}
                </button>
              ))}
              <p className='volunteerTasks'>
                Slightly Longer tasks (10-15 mins each)
              </p>
              {mediumTaskLocations.map((location, index) => (
                <button
                  id={
                    location === this.state.activeBtn
                      ? 'locationActiveBtn'
                      : 'locationBtn'
                  }
                  type='button'
                  className='btn btn-light'
                  onClick={(e) => this.selectLocationHandler(e, location)}
                >
                  {index + 1}. Call {location}
                </button>
              ))}
              <p className='volunteerTasks'>
                'I have some time' tasks (45-60 mins each)
              </p>
              {longTaskLocations.map((location, index) => (
                <button
                  id={
                    location === this.state.activeBtn
                      ? 'locationActiveBtn'
                      : 'locationBtn'
                  }
                  name={location + index}
                  type='button'
                  className='btn btn-light'
                  onClick={(e) => this.selectLocationHandler(e, location)}
                >
                  {index + 1}. Call {location}
                </button>
              ))}
            </div>

            <div id='locationForm' className='col-md-7 pl-md-5 ml-md-5 pb-md-5'>
              <div>
                <span
                  style={{
                    fontSize: '30px',
                    fontWeight: 600,
                    margin: '0px',
                  }}
                >
                  {this.state.locationName}!
                  <button
                    id='submitBtn'
                    type='submit'
                    style={{
                      float: 'right',
                    }}
                    className='button'
                    onClick={(event) => {
                      this.submitInfoHandler(event);
                    }}
                  >
                    Submit Info
                  </button>
                </span>

                <p style={{ fontSize: '14px', margin: '0px' }}>
                  <i className='fas fa-map-marker-alt pr-2'></i>
                  {this.state.address}
                </p>
                <p style={{ fontSize: '14px', margin: '0px' }}>
                  <i className='fas fa-phone-alt pr-1'></i>
                  {this.state.contact}
                </p>
                <p
                  style={{
                    fontSize: '15px',
                    margin: '0px',
                    fontStyle: 'italic',
                    paddingTop: '20px',
                  }}
                >
                  {this.state.locationName} is responding {this.state.response}.
                </p>
                {this.state.activeBtn === '' && <p>Pick a task.</p>}
                <p
                  className='volunteerTasks'
                  style={{
                    margin: '0px',
                  }}
                ></p>
                <form id='taskList'>
                  <p style={{ marginBottom: '0px', fontWeight: 400 }}>
                    Questions to ask
                  </p>
                  {this.state.locationName.toLowerCase().includes('hospital')
                    ? Object.entries(hospitalQuestionarre).map(
                        (value, index) => (
                          <div
                            className='form-group'
                            style={{ marginBottom: '5px' }}
                          >
                            <label
                              style={{ fontSize: '14px', marginBottom: '0px' }}
                            >
                              {index + 1}. {value[1]}
                            </label>
                            <input
                              type='number'
                              key={value[0] + index}
                              name={value[0]}
                              style={{ fontSize: '14px', marginBottom: '0px' }}
                              className='form-control'
                              placeholder={value[0]}
                            />
                          </div>
                        )
                      )
                    : Object.entries(pharmacyQuestionarre).map(
                        (value, index) => (
                          <div
                            className='form-group'
                            style={{ marginBottom: '5px' }}
                          >
                            <label
                              style={{ fontSize: '14px', marginBottom: '0px' }}
                            >
                              {index + 1}. {value[1]}
                            </label>
                            <input
                              type='number'
                              key={value[0] + index}
                              name={value[0]}
                              style={{ fontSize: '14px', marginBottom: '0px' }}
                              className='form-control'
                              placeholder={value[0]}
                            />
                          </div>
                        )
                      )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
