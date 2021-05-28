// Libraries ->
import React, { Component } from 'react';
import '../styles/style.css';
import AuthContext from '../services/AuthContext';
import { firestore } from '../services/Firebase';
import firebase from 'firebase/app';
import { updateTaskInfo } from '../services/FirebaseHandler';
import { toast } from '../scripts/script';
import moment from 'moment';

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
            taskLocations: [],
            activeBtn: '',
            beds: '',
            oxygen: '',
            newPatients: '',
            waitingPatients: '',
            remidisivir: '',
            reassignTime: '',
            taskTimerDisplay: '',
            expired: '',
            completeMsg: '',
            loading: true,
        };

        // Questionarre ->
        this.hospitalQuestionarre = {
            Beds: 'How many beds are available?',
            'Oxygen (in hours)': 'How much Oxygen is available?',
            'New Patients':
                'How many New Patients were admitted in the last hour?',
            'Waiting Patients': 'How many patients are waiting outside?',
            Remidisivir: 'How much Remidisivir is available?',
        };

        this.pharmacyQuestionarre = {
            Remidisivir: 'How much Remidisivir is available?',
        };
        // End of Questionarre ->

        // Preserve Initial State ->
        this.baseState = this.state;

        // Bind Functions ->
        this.clearInputs = this.clearInputs.bind(this);
        this.timeout = this.timeout.bind(this);
        this.fectAllDataHandler = this.fectAllDataHandler.bind(this);
        this.fetchTasks = this.fetchTasks.bind(this);
        this.fetchLocationData = this.fetchLocationData.bind(this);
        this.fetchTaskAssignTime = this.fetchTaskAssignTime.bind(this);
        this.taskTimer = this.taskTimer.bind(this);
        this.stringifyAddress = this.stringifyAddress.bind(this);
        this.stringifyContacts = this.stringifyContacts.bind(this);
        this.submitInfoHandler = this.submitInfoHandler.bind(this);
        this.selectLocation = this.selectLocation.bind(this);
        this.tasksAssignment = this.tasksAssignment.bind(this);
        this.displayQuestionarre = this.displayQuestionarre.bind(this);
        this.snackbar = this.snackbar.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.userLogOut = this.userLogOut.bind(this);
        this.checkInputFields = this.checkInputFields.bind(this);
    }

    // Clear All Inputs ->
    clearInputs() {
        this.setState({
            beds: '',
            oxygen: '',
            newPatients: '',
            waitingPatients: '',
            remidisivir: '',
        });
    }

    // Component Did Mount ->
    componentDidMount() {
        const { currentUser } = this.context;
        // Fetch User Info ->
        const userDocument = firestore.collection('volunteers');
        userDocument.doc(currentUser.uid).onSnapshot((doc) => {
            this.setState({
                userName: doc.data().name.split(' ')[0].trim(),
                tasks: doc.data().tasks_assigned,
            });
        });

        // Call Fetch All Data Handler
        this.fectAllDataHandler(currentUser.uid);
    }

    // Component Will Unmount ->
    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    // Add Delay (before or after any operation)
    timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Fetch All Data Handler (Tasks, Locations, Assign Time) ->
    async fectAllDataHandler(userId, delay = 2000) {
        this.setState({
            reassignTime: '',
            taskTimerDisplay: '',
        });
        try {
            await this.timeout(2000);
            await this.fetchTaskAssignTime(userId);
            await this.fetchTasks();
            Promise.all([
                setTimeout(() => {
                    this.fetchLocationData();
                    this.fetchTaskAssignTime(userId);
                }, delay),
            ])
                .then(() => {
                    this.interval = setInterval(this.taskTimer, 60000);
                    setTimeout(() => {
                        this.setState({ loading: false });
                    }, delay);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } catch (err) {
            console.log(err);
        }
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
                                tasks_assigned:
                                    firebase.firestore.FieldValue.arrayUnion(
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
                .get()
                .then((res) => {
                    const add = this.stringifyAddress(
                        res.data().Address.Street,
                        res.data().Address.City,
                        res.data().Address.State,
                        res.data().Address.Pincode
                    );
                    const contact = this.stringifyContacts(res.data().Contact);
                    this.setState({
                        taskLocations: [
                            ...this.state.taskLocations,
                            {
                                Task_Id: taskId,
                                Name: res.data().Name,
                                Address: res.data().Address,
                                Contact: res.data().Contact,
                                Type: res.data().Type,
                            },
                        ],
                        // Make Last Task Active ->
                        locationName: res.data().Name,
                        locationAddress: add,
                        locationContact: contact,
                        locationType: res.data().Type,
                        activeBtn: taskId,
                    });
                });
        });
    }

    // Fetch Reassign Time ->
    fetchTaskAssignTime(userId) {
        if (this.state.tasks.length) {
            var assignTime = 0;
            firestore
                .collection('assigned_tasks')
                .doc(this.state.tasks[0])
                .get()
                .then((res) => {
                    if (res.exists) {
                        assignTime = res.data().reassign_time.seconds;
                        this.setState({
                            reassignTime: assignTime,
                        });
                    }
                    if (Date.now() >= assignTime * 1000) {
                        this.setState({
                            loading: false,
                            reassignTime: '',
                        });
                        this.snackbar(
                            'Please wait, fetching critical Tasks ..'
                        );
                        firestore.collection('volunteers').doc(userId).update({
                            tasks_assigned: [],
                        });
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    }
                });
        }
        return 0;
    }

    // Reverse Task Timer ->
    taskTimer() {
        const duration = moment.duration(
            this.state.reassignTime * 1000 - Date.now()
        );
        if (duration.minutes() <= 0) {
            this.setState({
                taskTimerDisplay: '(Expired)',
            });
        } else if (duration.hours() < 1) {
            this.setState({
                taskTimerDisplay:
                    '(New Tasks in ' + duration.minutes() + ' minutes)',
            });
        } else {
            this.setState({
                taskTimerDisplay:
                    '(New Tasks in ' +
                    duration.hours() +
                    ' hours ' +
                    duration.minutes() +
                    ' minutes)',
            });
        }
    }

    // Combine address from street, city, state & pincode ->
    stringifyAddress(street, city, state, pincode) {
        return (
            (street ? street + ', ' : '') +
            (city ? city + ', ' : '') +
            (state ? state : 'New Delhi') +
            (pincode.toString() ? '-' + pincode.toString() : '')
        );
    }

    // Combine contacts ->
    stringifyContacts(Contact) {
        // return Contact[0] + (Contact[1] ? ', ' + Contact[1] : '');
        return (
            <>
                <a href={`tel:${Contact[0]}`}>{Contact[0]}</a>
                {Contact[1] && (
                    <>
                        , <a href={`tel:${Contact[1]}`}>{Contact[1]}</a>
                    </>
                )}
            </>
        );
    }

    // Submit Event Handler ->
    async submitInfoHandler(e, taskId) {
        e.preventDefault();
        const { currentUser } = this.context;
        try {
            this.setState({
                loading: true,
            });

            // Update task info in 'locations' collection ->
            await updateTaskInfo(
                taskId,
                this.state.beds,
                this.state.oxygen,
                this.state.remidisivir,
                this.state.newPatients,
                this.state.waitingPatients
            );

            // Clear all Inputs ->
            this.clearInputs();

            // Remove Task Id from tasks & taskLocations array in state object ->
            this.setState({
                tasks: [...this.state.tasks].filter((id) => id !== taskId),
                taskLocations: [...this.state.taskLocations].filter(
                    (val) => val.Task_Id !== taskId
                ),
            });

            // Update task_assigned array in 'volunteer' collections ->
            await firestore
                .collection('volunteers')
                .doc(currentUser.uid)
                .update({
                    tasks_assigned:
                        firebase.firestore.FieldValue.arrayRemove(taskId),
                    tasks_completed: firebase.firestore.FieldValue.increment(1),
                });

            // Update reassign_time inside 'assigned' collections ->
            await firestore
                .collection('assigned_tasks')
                .doc(taskId)
                .update({
                    last_updated_at: new Date(),
                    reassign_time: new Date(Date.now() + 60 * 60 * 1000),
                });

            // Change Active State ->
            if (this.state.tasks.length) {
                // Change Active State Button ->
                this.setState({
                    activeBtn: this.state.tasks[this.state.tasks.length - 1],
                });

                // Change Location on Form Based on Active State Button ->
                this.selectLocation(
                    e,
                    this.state.taskLocations.find(
                        (id) => id.Task_Id === this.state.activeBtn
                    )
                );
            }
        } catch (err) {
            console.log(err);
        }

        this.setState({
            loading: false,
        });

        // On Completion Show Congratulations & Fetch New Sets of Tasks ->
        if (this.state.tasks.length === 0) {
            this.snackbar(
                'Congratulations !! You have completed all the Tasks ..'
            );
            const p = new Promise((res, rej) => {
                setTimeout(res, 4800);
            });
            p.then(() => {
                setTimeout(() => {
                    this.snackbar('Fetching new set of Tasks ..');
                }, 500);
            })
                .then(() => {
                    this.fectAllDataHandler(currentUser.uid, 3000);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }

        if (this.state.tasks.length) {
            // Display Task Completion Message
            this.snackbar('Thank you for your help ..');
        }
    }

    // Set Location Function ->
    selectLocation(e, taskInfo) {
        this.clearInputs();
        console.log(taskInfo);
        const address = this.stringifyAddress(
            taskInfo['Address']['Street'],
            taskInfo['Address']['City'],
            taskInfo['Address']['State'],
            taskInfo['Address']['Pincode']
        );

        const contact = this.stringifyContacts(taskInfo['Contact']);
        this.setState({
            locationName: taskInfo['Name'],
            locationAddress: address,
            locationContact: contact,
            locationType: taskInfo['Type'],
            activeBtn: taskInfo.Task_Id,
        });
    }

    // Task Assignment Function ->
    tasksAssignment = (Locations) => {
        return Locations.reverse().map((tasks, index) => {
            return (
                <button
                    key={tasks.Task_Id + index}
                    id={
                        this.state.activeBtn === tasks.Task_Id
                            ? 'textButtonActive'
                            : 'textButton'
                    }
                    type='button'
                    onClick={(e) => this.selectLocation(e, tasks)}
                >
                    <div>
                        <p>{index + 1}.</p>{' '}
                    </div>
                    <div>
                        <p>Call {tasks.Name}</p>
                    </div>
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
                    <p className='questions'>
                        {index + 1}. {value[1]}
                    </p>
                    <input
                        type='number'
                        name={name}
                        className='form-control'
                        value={this.state[name]}
                        placeholder={value[0]}
                        min='0'
                        onChange={this.onChangeHandler}
                    />
                </div>
            );
        });
    };

    // Snackbar (Complete Task Status) ->
    snackbar(msg) {
        this.setState({
            completeMsg: msg,
        });
        toast();
    }

    // On Change Handler ->
    onChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
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

    // Prevent Submission of Empty Form ->
    checkInputFields(e) {
        e.preventDefault();
        if (
            this.state.beds ||
            this.state.oxygen ||
            this.state.remidisivir ||
            this.state.waitingPatients ||
            this.state.newPatients
        ) {
            this.submitInfoHandler(e, this.state.activeBtn);
        } else {
            this.snackbar('Please fill out the info ..');
        }
    }

    render() {
        return (
            <>
                {/* Ternary Operator to dispaly Spinner while DOM is Rendering -> */}
                {this.state.loading ? (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            color: 'white',
                        }}
                    >
                        <div className='spinner-border' role='status'>
                            <span className='sr-only'>Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Logout Button */}
                        <div id='logoutPlace' className='float-right'>
                            <button
                                id='primaryButton'
                                className='button'
                                onClick={this.userLogOut}
                            >
                                Logout
                            </button>
                        </div>

                        {/* Snackbar */}
                        <div id='snackBar' style={{ left: '10px' }}>
                            {this.state.completeMsg}
                        </div>

                        {/* Only Show Content on Page when there is a task Location Array -> */}
                        {this.state.taskLocations.length > 0 && (
                            <div id='dashboard' className='container-fluid'>
                                <div className='taskDashboard'>
                                    <div className='volunteerTasks'>
                                        <h2>Welcome {this.state.userName}!</h2>
                                        {this.state.activeBtn && (
                                            <p className='padbL'>
                                                Pick a task.{' '}
                                                {this.state.taskTimerDisplay}
                                            </p>
                                        )}

                                        {/* Small Tasks
                                        <p className='taskList'>
                                            My Tasks
                                        </p> */}
                                        <div className='taskButtons'>
                                            {this.tasksAssignment(
                                                this.state.taskLocations
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        id='locationForm'
                                        className='taskDetails'
                                    >
                                        <div id='hospDetails' className='padbL'>
                                            {/* Hospital Details */}
                                            <div>
                                                <h4>
                                                    {this.state.locationName}
                                                </h4>
                                                <h6 id='phone'>
                                                    {/* <i className='fas fa-phone-alt pr-1'></i> */}
                                                    {this.state.locationContact}
                                                </h6>
                                                <h6 id='address'>
                                                    {/* <i className='fas fa-map-marker-alt pr-2'></i> */}
                                                    {this.state.locationAddress}
                                                </h6>
                                            </div>

                                            <div>
                                                {/* Submit Button */}
                                                <button
                                                    id='primaryButton'
                                                    type='submit'
                                                    className='button float-right'
                                                    form='taskList'
                                                    onClick={(event) => {
                                                        this.checkInputFields(
                                                            event
                                                        );
                                                    }}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>

                                        <form id='taskList'>
                                            <p className='padtL'>
                                                Questions to ask
                                            </p>
                                            {/* Questionarre (Hospital/Pharmacy) */}
                                            {this.state.locationType.toLowerCase() ===
                                            'hospital'
                                                ? this.displayQuestionarre(
                                                      this.hospitalQuestionarre
                                                  )
                                                : this.displayQuestionarre(
                                                      this.pharmacyQuestionarre
                                                  )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </>
        );
    }
}

export default Dashboard;
