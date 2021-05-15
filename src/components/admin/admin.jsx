import React, { Component } from 'react';
import '../../styles/style.css';
import AuthContext from '../../services/AuthContext';
import delhiHospitals from '../../utilities/delhiHospitals.json';
import { addLocationData, addNewTasks } from '../../services/FirebaseHandler';

export class Admin extends Component {
    static contextType = AuthContext;
    constructor(props){
        super(props)
        this.state = {
            response1 : '',
            response2 : '',
            response3 : '',
        }

        this.addHospitals = this.addHospitals.bind(this)
        this.addTasks = this.addTasks.bind(this)
    }

    clearResponse(){
        this.setState({
            response1 : '',
            response2 : '',
            response3 : ''
        })
    }

    async addHospitals() {
        this.clearResponse()
        try{
            await addLocationData(delhiHospitals);
            this.setState({
                response1 : 'Location Data Added Successfully'
            })
        } catch(err){
            this.setState({
                response1 : err.message
            })
        }
    }

    async addTasks() {
        this.clearResponse()
        try{
            await addNewTasks();
            this.setState({
                response2 : 'Task Data Added Successfully'
            })
        } catch(err){
            this.setState({
                response2 : err.message
            })
        }
    }

    render() {
        return (
            <>
                <div id='logoutPlace' className='float-right'>
                    <button
                        id='logOut'
                        className='button'
                        onClick={this.userLogOut}
                    >
                        Logout
                    </button>
                </div>
                {/* Add Hospital Data to Backend -> */}
                <div className='container'>
                    <div className = 'row d-flex justify-content-center mt-5'>
                        <div className = 'col-md-10'>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">OPERATION</th>
                                    <th scope="col">ACTION</th>
                                    <th scope="col">RESPONSE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>
                                        Add Location Data
                                    </td>
                                    <td>
                                        <button
                                            type='button'
                                            className='btn btn-outline-light btn-sm'
                                            onClick={this.addHospitals}
                                        >
                                            Add
                                        </button>
                                    </td>
                                    <td>{this.state.response1}</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>
                                        Add List of Unassign Tasks
                                    </td>
                                    <td>
                                        <button
                                            type='button'
                                            className='btn btn-outline-light btn-sm'
                                            onClick={this.addTasks}
                                        >
                                            Add
                                        </button>
                                    </td>
                                    <td>{this.state.response2}</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td >
                                        Run Cron Job
                                    </td>
                                    <td>
                                        <button
                                            type='button'
                                            className='btn btn-outline-light btn-sm'
                                            onClick= ''
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
            </>
        );
    }
}

export default Admin;
