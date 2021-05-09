import React, { Component } from 'react';
import '../../styles/style.css';
import AuthContext from '../../services/AuthContext';
import delhiHospitals from '../../utilities/delhiHospitals.json';
import { addLocationData } from '../../services/FirebaseHandler';

export class Admin extends Component {
    static contextType = AuthContext;

    addHospitals() {
        addLocationData(delhiHospitals);
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
                    <div style={{ color: 'white' }}>
                        Add All Hospitals -{' '}
                        <button
                            type='button'
                            class='btn btn-primary btn-sm'
                            onClick={this.addHospitals}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

export default Admin;
