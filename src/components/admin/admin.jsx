// Libraries ->
import React, { Component } from 'react';
import { analytics, firestore } from '../../services/Firebase';
import { addLocationData, addNewTasks } from '../../services/FirebaseHandler';
import AuthContext from '../../services/AuthContext';
import delhiHospitals from '../../utilities/delhiHospitals.json';
import Schedule from 'react-schedule-job'
import '../../styles/style.css';

// Stylesheet for Cron Job Table ->
// import 'react-schedule-job/dist/index.css'

export class Admin extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            response1: '',
            response2: '',
            response3: '',
        };

        // Bind Functions ->
        this.addHospitals = this.addHospitals.bind(this);
        this.addTasks = this.addTasks.bind(this);
        this.userLogOut = this.userLogOut.bind(this);
        this.clearResponse = this.clearResponse.bind(this);
        this.cronJobs = this.cronJobs.bind(this);
    }

    // Clear All Responses ->
    clearResponse() {
        this.setState({
            response1: '',
            response2: '',
            response3: '',
        });
    }

    // Add Location Data Handler ->
    async addHospitals() {
        this.clearResponse();
        try {
            await addLocationData(delhiHospitals);
            this.setState({
                response1: 'Location Data Added Successfully',
            });
        } catch (err) {
            this.setState({
                response1: err.message,
            });
        }
    }

    // Add Tasks Data Handler ->
    async addTasks() {
        this.clearResponse();
        try {
            await addNewTasks();
            this.setState({
                response2: 'Task Data Added Successfully',
            });
        } catch (err) {
            this.setState({
                response2: err.message,
            });
        }
    }

    // User Log Out Handler ->
    async userLogOut() {
        const { logout } = this.context;
        try {
            await logout();
            this.props.history.push('/volunteer');
        } catch (err) {
            console.log(err.message);
        }
    }

    cronJobs() {
        this.clearResponse();
        const taskDocuments = firestore.collection('assigned_tasks');
        taskDocuments
            .get()
            .then((res) => {
                res.docs.forEach((task) => {
                    const expiryTime = task.data().reassign_time.seconds;
                    const diff = Date.now() - expiryTime * 1000;
                    if (diff >= 0) {
                        firestore
                            .collection('unassigned_tasks')
                            .doc(task.id)
                            .set({
                                ...task.data(),
                            });
                        firestore
                            .collection('assigned_tasks')
                            .doc(task.id)
                            .delete();
                    }
                });
                analytics.logEvent('run_cron_job');
                this.setState({
                    response3: 'Cron Job Ran Successfully',
                });
            })
            .catch((err) => {
                this.setState({
                    response3: err.message,
                });
            });
    }

    render() {
        return (
            <>
                <div id='logoutPlace' className='float-right'>
                    <button
                        id='primaryButton'
                        className='button'
                        onClick={this.userLogOut}
                    >
                        Logout
                    </button>
                </div>
                <div className='container'>
                    <div className='row d-flex justify-content-center mt-5'>
                        <div className='col-md-10'>
                            <table className='table table-hover'>
                                <thead>
                                    <tr>
                                        <th scope='col'>#</th>
                                        <th scope='col'>OPERATION</th>
                                        <th scope='col'>ACTION</th>
                                        <th scope='col'>RESPONSE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Add Hospital Data to Firebase */}
                                    <tr>
                                        <th scope='row'>1</th>
                                        <td>Add Location Data</td>
                                        <td>
                                            <button
                                                type='button'
                                                className='btn btn-outline-secondary btn-sm'
                                                onClick={this.addHospitals}
                                            >
                                                Add
                                            </button>
                                        </td>
                                        <td>{this.state.response1}</td>
                                    </tr>

                                    {/* Add Tasks Data to Firebase */}
                                    <tr>
                                        <th scope='row'>2</th>
                                        <td>Add List of Unassign Tasks</td>
                                        <td>
                                            <button
                                                type='button'
                                                className='btn btn-outline-secondary btn-sm'
                                                onClick={this.addTasks}
                                            >
                                                Add
                                            </button>
                                        </td>
                                        <td>{this.state.response2}</td>
                                    </tr>

                                    {/* Run Cron Job Manually */}
                                    <tr>
                                        <th scope='row'>3</th>
                                        <td>Run Cron Job</td>
                                        <td>
                                            <button
                                                type='button'
                                                className='btn btn-outline-secondary btn-sm'
                                                onClick={this.cronJobs}
                                            >
                                                Run
                                            </button>
                                        </td>
                                        <td>{this.state.response3}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Cron Jobs Dashboard*/}
                {/* <Schedule
                    jobs={[
                        {
                            fn: this.cronJobs,
                            id: '1',
                            schedule: '0,30 * * * *',
                            name: 'Run cron job',
                        },
                    ]}
                    timeZone='Asia/Kolkata'
                    dashboard={{
                        hidden: true,
                    }}
                /> */}
            </>
        );
    }
}

export default Admin;
