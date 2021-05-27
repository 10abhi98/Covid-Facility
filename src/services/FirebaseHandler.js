import { analytics, firestore } from './Firebase';
import firebase from 'firebase/app';

// Create New User ->
function addUserData(userId, name, email, contact) {
    const userDocument = firestore.collection('volunteers');
    userDocument.doc(userId).set({
        volunteer_id: userId,
        name: name,
        email: email,
        contact: contact,
        tasks_assigned: [],
        tasks_completed: 0,
        type: 'On-Call Activist',
        role: 'ROLE_VOLUNTEER',
    });
    analytics.logEvent('added_user_data');
}

// Fetch user Role ->
function getUserRole(userId) {
    const userDocument = firestore.collection('volunteers');
    return userDocument
        .doc(userId)
        .get()
        .then((snapshot) => snapshot.data().role);
}

// Add Locations Data ->
function addLocationData(locations) {
    const locationDocument = firestore.collection('locations');
    locations.forEach((loc) => {
        const time = new Date(loc['Tasks_Info']['Beds']['Verified_At'] * 1000);
        console.log(loc['Coordinates']['Lat']);
        locationDocument.add(loc).then((res) => {
            locationDocument.doc(res.id).update({
                'Tasks_Info.Beds.Verified_At': time,
                'Tasks_Info.Oxygen.Verified_At': time,
                Coordinates: new firebase.firestore.GeoPoint(
                    loc['Coordinates']['Lat']
                        ? loc['Coordinates']['Lat']
                        : 28.5883,
                    loc['Coordinates']['Long']
                        ? loc['Coordinates']['Long']
                        : 77.1525
                ),
            });
        });
    });
    console.log('Insertion Sucesssfull');
}

// Add New Tasks ->
function addNewTasks() {
    const locationDocument = firestore.collection('locations');
    locationDocument.get().then((res) => {
        res.docs.forEach((task) => {
            firestore
                .collection('unassigned_tasks')
                .doc(task.id)
                .set({
                    task_id: task.id,
                    task_name: 'Call ' + task.data().Name,
                    reassign_time: new Date(),
                    last_updated_at: new Date(),
                });
        });
    });
}

// Update Task Information ->
function updateTaskInfo(
    taskId,
    beds,
    oxygen,
    remidisivir,
    newPatients,
    waitingPatients
) {
    const taskDocument = firestore.collection('locations').doc(taskId);

    firestore.runTransaction((transaction) => {
        return transaction.get(taskDocument).then((doc) => {
            transaction.update(taskDocument, {
                Tasks_Info: {
                    Beds: {
                        Count: beds ? beds : doc.data().Tasks_Info.Beds.Count,
                        Verified_At: beds
                            ? new Date()
                            : doc.data().Tasks_Info.Beds.Verified_At,
                    },
                    Oxygen: {
                        Count: oxygen
                            ? oxygen
                            : doc.data().Tasks_Info.Oxygen.Count,
                        Verified_At: oxygen
                            ? new Date()
                            : doc.data().Tasks_Info.Oxygen.Verified_At,
                    },
                    Remidisivir: {
                        Count: remidisivir
                            ? remidisivir
                            : doc.data().Tasks_Info.Remidisivir.Count,
                        Verified_At: remidisivir
                            ? new Date()
                            : doc.data().Tasks_Info.Remidisivir.Verified_At,
                    },
                    New_Patients: {
                        Count: newPatients
                            ? newPatients
                            : doc.data().Tasks_Info.New_Patients.Count,
                        Verified_At: newPatients
                            ? new Date()
                            : doc.data().Tasks_Info.New_Patients.Verified_At,
                    },
                    Waiting_Patients: {
                        Count: waitingPatients
                            ? waitingPatients
                            : doc.data().Tasks_Info.Waiting_Patients.Count,
                        Verified_At: waitingPatients
                            ? new Date()
                            : doc.data().Tasks_Info.Waiting_Patients
                                  .Verified_At,
                    },
                },
            });
        });
    });
    // taskDocument.doc(taskId).update({
    // Tasks_Info: {
    //     Beds: {
    //         Count: beds ,
    //         Verified_At: new Date(),
    //     },
    //     Oxygen: {
    //         Count: oxygen,
    //         Verified_At: new Date(),
    //     },
    //     Remidisivir: {
    //         Count: remidisivir,
    //         Verified_At: new Date(),
    //     },
    //     New_Patients: {
    //         Count: newPatients,
    //         Verified_At: new Date(),
    //     },
    //     Waiting_Patients: {
    //         Count: waitingPatients,
    //         Verified_At: new Date(),
    //     },
    // },
    // });
}

export {
    addUserData,
    getUserRole,
    addLocationData,
    addNewTasks,
    updateTaskInfo,
};
