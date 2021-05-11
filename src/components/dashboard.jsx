// Libraries ->
import React, { Component } from 'react';
import '../styles/style.css';
import AuthContext from '../services/AuthContext';
import { firestore } from '../services/Firebase';
import firebase from 'firebase/app';
import { updateTaskInfo } from '../services/FirebaseHandler';

// Questionarre ->
let hospitalQuestionarre = {
    Beds: 'How many beds are available?',
    Oxygen: 'How much Oxygen is available?',
    'New Patients': 'How many New Patients were admitted in the last hour?',
    'Waiting Patients': 'How many patients are waiting outside?',
    Remidisivir: 'How much Remidisivir is available?',
};

let pharmacyQuestionarre = {
    Remidisivir: 'How much Remidisivir is available?',
};
// End of Questionarre ->

class Dashboard extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            locationName: '',
            locationAddress: '',
            locationContact: '',
            locationType: '',
            userName: '',
            tasks: [],
            taskLocations: {},
            activeBtn: '',
            beds: '',
            oxygen: '',
            newPatients: '',
            waitingPatients: '',
            remidisivir: '',
        };

        // Bind Functions ->
        this.clearInputs = this.clearInputs.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.stringifyAddress = this.stringifyAddress.bind(this);
        this.submitInfoHandler = this.submitInfoHandler.bind(this);
        this.selectLocation = this.selectLocation.bind(this);
        this.userLogOut = this.userLogOut.bind(this);
        this.tasksAssignment = this.tasksAssignment.bind(this);
        this.displayQuestionarre = this.displayQuestionarre.bind(this);
        this.fetchTasks = this.fetchTasks.bind(this);
        this.fetchLocationData = this.fetchLocationData.bind(this);
    }

    clearInputs() {
        this.setState({
            beds: '',
            oxygen: '',
            newPatients: '',
            waitingPatients: '',
            remidisivir: '',
        });
    }

    componentDidMount() {
        const { currentUser } = this.context;
        // Fetch User Info ->
        const userDocument = firestore.collection('volunteers');
        userDocument.doc(currentUser.uid).onSnapshot((doc) => {
            this.setState({
                userName: doc.data().name.split(' ')[0].trim(),
                tasks: doc.data().tasks_assigned,
            });
            // Fetch Task ->
            this.fetchTasks();
            // Fetch Hospital Data ->
            this.fetchLocationData();
        });
    }

    // Task Assignment ->
    fetchTasks() {
        const { currentUser } = this.context;
        if (this.state.tasks.length === 0) {
            firestore
                .collection('unassigned_tasks')
                .orderBy('last_updated_at')
                .limit(5)
                .get()
                .then((tasks) => {
                    tasks.docs.forEach((task) => {
                        // Add Task to Volunteer Task Assigned Array ->
                        firestore
                            .collection('volunteers')
                            .doc(currentUser.uid)
                            .update({
                                tasks_assigned: firebase.firestore.FieldValue.arrayUnion(
                                    task.id
                                ),
                            });

                        // Add Taks to Assigned Task Collection
                        firestore
                            .collection('assigned_tasks')
                            .doc(task.id)
                            .set({
                                task_id: task.id,
                                task_name: task.data().task_name,
                                reassign_time: new Date(
                                    Date.now() + 3 * 60 * 60 * 1000
                                ),
                                last_updated_at: task.data().last_updated_at,
                            });

                        // Remove Tasks from Unassigned Task Collections ->
                        firestore
                            .collection('unassigned_tasks')
                            .doc(task.id)
                            .delete();
                    });
                });
        }
    }

    // Fetch Location Data ->
    fetchLocationData() {
        this.state.tasks.forEach((taskId) => {
            firestore
                .collection('locations')
                .doc(taskId)
                .onSnapshot((res) => {
                    const add = this.stringifyAddress(
                        res.data().Address.Street,
                        res.data().Address.City,
                        res.data().Address.State,
                        res.data().Address.Pincode
                    );
                    this.setState((prevState) => ({
                        taskLocations: {
                            ...prevState.taskLocations,
                            [taskId]: {
                                Name: res.data().Name,
                                Address: res.data().Address,
                                Contact: res.data().Contact,
                                Type: res.data().Type,
                            },
                        },
                        locationName: res.data().Name,
                        locationAddress: add,
                        locationContact: res.data().Contact,
                        locationType: res.data().Type,
                        activeBtn: taskId,
                    }));
                });
        });
        // Make First Task Active ->
    }

    // On Change Handler
    onChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    // Combine address from street, city,
    stringifyAddress(street, city, state, pincode) {
        const address =
            (street ? street + ', ' : '') +
            (city ? city + ', ' : '') +
            (state ? state : 'New Delhi') +
            (pincode ? '-' + pincode : '');
        return address;
    }

    // Submit Event Handler
    async submitInfoHandler(e, taskId) {
        e.preventDefault();
        await updateTaskInfo(
            taskId,
            this.state.beds,
            this.state.oxygen,
            this.state.remidisivir,
            this.state.newPatients,
            this.state.waitingPatients
        );
        this.clearInputs();
    }

    // Set Location Function ->
    selectLocation(e, taskInfo) {
        this.clearInputs();
        const address = this.stringifyAddress(
            taskInfo[1]['Address']['Street'],
            taskInfo[1]['Address']['City'],
            taskInfo[1]['Address']['State'],
            taskInfo[1]['Address']['Pincode']
        );

        const contact =
            taskInfo[1]['Contact'][0] +
            (taskInfo[1]['Contact'][1] ? ', ' + taskInfo[1]['Contact'][1] : '');
        this.setState({
            locationName: taskInfo[1]['Name'],
            locationAddress: address,
            locationContact: contact,
            locationType: taskInfo[1]['Type'],
            activeBtn: taskInfo[0],
        });
    }

    // Task Assignment Function ->
    tasksAssignment = (Locations) => {
        return Object.entries(Locations)
            .reverse()
            .map((taskId, index) => {
                return (
                    <button
                        key={taskId + index}
                        className={
                            this.state.activeBtn === taskId[0]
                                ? 'locationActiveBtn'
                                : 'locationBtn'
                        }
                        type='button'
                        onClick={(e) => this.selectLocation(e, taskId)}
                    >
                        <span>
                            {index + 1}. Call {taskId[1].Name}
                        </span>
                    </button>
                );
            });
    };

    // Questionarre Display Function ->
    displayQuestionarre = (type) => {
        return Object.entries(type).map((value, index) => {
            const val = value[0].split(' ');
            const name =
                val.length === 2
                    ? val[0].toLowerCase() + val[1]
                    : val[0].toLowerCase();
            return (
                <div className='form-group' key={value[0] + index}>
                    <label>
                        {index + 1}. {value[1]}
                    </label>
                    <input
                        type='number'
                        name={name}
                        className='form-control'
                        value={this.state[name]}
                        placeholder={value[0]}
                        onChange={this.onChangeHandler}
                    />
                </div>
            );
        });
    };

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
                <div id='dashboard' className='container-fluid'>
                    <div className='row ml-md-5'>
                        <div className='col-md-5 pl-md-5'>
                            <h2>Welcome {this.state.userName}!</h2>
                            {this.state.activeBtn && <p>Pick a task.</p>}

                            {/* Small Tasks */}
                            <p className='volunteerTasks'>
                                Quick tasks (2-3 mins each)
                            </p>
                            {this.tasksAssignment(this.state.taskLocations)}

                            {/* Medium Tasks */}
                            {/* <p className='volunteerTasks'>
                                Slightly Longer tasks (10-15 mins each)
                            </p>
                            {this.tasksAssignment(mediumTaskLocations)} */}

                            {/* Long Tasks */}
                            {/* <p className='volunteerTasks'>
                                'I have some time' tasks (45-60 mins each)
                            </p>
                            {this.tasksAssignment(longTaskLocations)} */}
                        </div>

                        <div id='locationForm' className='col-md-7'>
                            <div className='p-1'>
                                {/* Hospital Details */}
                                <div id='hospDetails'>
                                    <span>{this.state.locationName}!</span>
                                    <p>
                                        <em>
                                            {/* Responding {this.state.response}. */}
                                        </em>
                                    </p>
                                    <p>
                                        <i className='fas fa-map-marker-alt pr-2'></i>
                                        {this.state.locationAddress}
                                        <br />
                                        <i className='fas fa-phone-alt pr-1'></i>
                                        {this.state.locationContact}
                                    </p>
                                </div>
                                <form id='taskList'>
                                    <p>Questions to ask</p>
                                    {this.state.locationName}
                                    {/* Questionarre (Hospital/Pharmacy) */}
                                    {this.state.locationType.toLowerCase() ===
                                    'hospital'
                                        ? this.displayQuestionarre(
                                              hospitalQuestionarre
                                          )
                                        : this.displayQuestionarre(
                                              pharmacyQuestionarre
                                          )}
                                    {/* Submit Button */}
                                    <button
                                        id='submitBtn'
                                        type='submit'
                                        className='button float-right'
                                        onClick={(event) => {
                                            this.submitInfoHandler(
                                                event,
                                                this.state.activeBtn
                                            );
                                        }}
                                    >
                                        Submit Info
                                    </button>
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
