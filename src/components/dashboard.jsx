// Libraries ->
import React, { Component } from "react";
import "../styles/style.css";
import AuthContext from "../services/AuthContext";
import { getUserData } from "../services/FirebaseHandler";
import { firestore } from "../services/Firebase";
import firebase from "firebase/app";
// Sample Data ->
let smallTaskLocations = ["Ganga Ram Hospital", "Medicare Pharmacy"];
let mediumTaskLocations = ["Shree Hospital", "Dharamvir Pharmacy"];
let longTaskLocations = ["Sant Soham Hospital"];
let hospitalQuestionarre = {
    Beds: "How many beds are available?",
    Oxygen: "How much Oxygen is available?",
    "New Patients": "How many New Patients were admitted in the last hour?",
    "Waiting Patients": "How many patients are waiting outside?",
    Remidisivir: "How much Remidisivir is available?",
};
let locationDetails = {
    name: [
        "Ganga Ram Hospital",
        "Medicare Pharmacy",
        "Shree Hospital",
        "Dharamvir Pharmacy",
        "Sant Soham Hospital",
    ],
    address: [
        "Jawahar Lal Nehru Marg,Delhi.110002",
        "Model Town",
        "Saket",
        "Rohini",
        "Sarita Vihar",
    ],
    contact: [9865341234, 7653412345, 8765432112, 9734501821, 7340501234],
    response: ["Quickly", "Late", "Quickly", "Late", "Quickly"],
};
let pharmacyQuestionarre = {
    Remidisivir: "How much Remidisivir is available?",
};
// End of Sample Data ->


class Dashboard extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            locationName: '',
            locationAddress: '',
            locationContact: '',
            userName: '',
            tasks: [],
            taskLocations : {},
            activeBtn: '',
            beds: "",
            oxygen: "",
            newPatients: "",
            waitingPatients: "",
            remidisivir: "",

        };

        // Bind Functions ->
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.submitInfoHandler = this.submitInfoHandler.bind(this);
        this.selectLocation = this.selectLocation.bind(this);
        this.userLogOut = this.userLogOut.bind(this);
        this.tasksAssignment = this.tasksAssignment.bind(this);
        this.displayQuestionarre = this.displayQuestionarre.bind(this);
        this.fetchTasks = this.fetchTasks.bind(this);
        this.fetchLocationData = this.fetchLocationData.bind(this);
    }

    componentDidMount() {
        const { currentUser } = this.context;
        // Fetch User Info ->
        const userDocument = firestore.collection("volunteers");
        userDocument.doc(currentUser.uid).onSnapshot((doc) => {
            this.setState({
                userName: doc.data().name.split(" ")[0].trim(),
                tasks: doc.data().tasks_assigned,
            });
            // Fetch Task ->
            this.fetchTasks();
            // Fetch Hospital Data ->
            this.fetchLocationData()
        });
    }

    componentDidUpdate(){
        
    }

    // Task Assignment ->
    fetchTasks() {
        const { currentUser } = this.context;
        if (this.state.tasks.length === 0) {
            firestore
                .collection("unassigned_tasks")
                .orderBy("last_updated_at")
                .limit(5)
                .get()
                .then((tasks) => {
                    tasks.docs.forEach((task) => {
                        // Add Task to Volunteer Task Assigned Array ->
                        firestore
                            .collection("volunteers")
                            .doc(currentUser.uid)
                            .update({
                                tasks_assigned: firebase.firestore.FieldValue.arrayUnion(
                                    task.id
                                ),
                            });
                        
                        // Add Taks to Assigned Task Collection
                        firestore.collection('assigned_tasks').doc(task.id).set({
                            task_id: task.id,
                            task_name: task.data().task_name,
                            reassign_time: new Date(Date.now() + (3*60*60*1000)),
                            last_updated_at: task.data().last_updated_at,
                        })

                        // Remove Tasks from Unassigned Task Collections ->
                        firestore.collection('unassigned_tasks').doc(task.id).delete();
                        
                    });
                });
        }
    }

    // Fetch Location Data ->
    fetchLocationData(){
        this.state.tasks.forEach((taskId) => {
            firestore.collection('locations').doc(taskId).get().then((res) =>{
                this.state.taskLocations[taskId] = {
                    'Name' : res.data().Name,
                    'Address' : res.data().Address,
                    'Contact' : res.data().Contact,
                    'Type' : res.data().Type
                };
            })
        })
        // Make First Task Active ->
        this.setState({
            locationName : Object.values(this.state.taskLocations)[0],
            activeBtn : this.state.tasks[0]
        })
    }

    // On Change Handler
    onChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    // Submit Event Handler
    submitInfoHandler(e) {
        e.preventDefault();
        console.log(
            "Beds             ->" +
                this.state.beds +
                "\n" +
                "Oxygen           ->" +
                this.state.oxygen +
                "\n" +
                "New Patients     ->" +
                this.state.newPatients +
                "\n" +
                "Waiting Patients ->" +
                this.state.waitingPatients +
                "\n" +
                "Remidisivir      ->" +
                this.state.remidisivir +
                "\n"
        );
    }

    // Set Location Function ->
    selectLocation(e, taskId) {
        const address =
            (taskId['Address']['Street']
                ? taskId['Address']['Street'] + ','
                : '') +
            (taskId['Address']['City'] ? taskId['Address']['City'] + ',' : '') +
            (taskId['Address']['State']
                ? taskId['Address']['State']
                : 'New Delhi') +
            (taskId['Address']['Pincode']
                ? '-' + taskId['Address']['Pincode']
                : '');
        const contact =
            taskId['Contact'][0] +
            (taskId['Contact'][1] ? ', ' + taskId['Contact'][1] : '');
        this.setState({
            locationName: taskId.Name,
            locationAddress: address,
            locationContact: contact,
            activeBtn: taskId
        });
    }

    // Task Assignment Function ->
    tasksAssignment = (Locations) => {
        return Object.entries(Locations).map((taskId, index) =>{
            return (
                <button
                    key={taskId + index}
                    className={
                        this.state.activeBtn === taskId
                            ? "locationActiveBtn"
                            : "locationBtn"
                    }
                    type='button'
                    onClick={(e) => this.selectLocation(e, taskId)}
                >
                    <span>
                        {index + 1}. Call {taskId.Name}
                    </span>
                </button>
            );
        })
    };

    // Questionarre Display Function ->
    displayQuestionarre = (type) => {
        return Object.entries(type).map((value, index) => {
            const val = value[0].split(" ");
            return (
                <div className='form-group' key={value[0] + index}>
                    <label>
                        {index + 1}. {value[1]}
                    </label>
                    <input
                        type='number'
                        name={
                            val.length === 2
                                ? val[0].toLowerCase() + val[1]
                                : val[0].toLowerCase()
                        }
                        className='form-control'
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
            this.props.history.push("/volunteer");
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
                                        {this.state.address}
                                        <br />
                                        <i className='fas fa-phone-alt pr-1'></i>
                                        {this.state.contact}
                                    </p>
                                </div>
                                <form id='taskList'>
                                    <p>Questions to ask</p>
                                    {/* Questionarre (Hospital/Pharmacy) */}
                                    {/* {this.state.locationName
                                        .toLowerCase()
                                        .includes("hospital")
                                        ? this.displayQuestionarre(
                                              hospitalQuestionarre
                                          )
                                        : this.displayQuestionarre(
                                              pharmacyQuestionarre
                                          )} */}
                                    {/* Submit Button */}
                                    <button
                                        id='submitBtn'
                                        type='submit'
                                        className='button float-right'
                                        onClick={(event) => {
                                            this.submitInfoHandler(event);
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
