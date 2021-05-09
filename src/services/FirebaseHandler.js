import { firestore } from './Firebase';
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
    });
}

// Fetch User Name ->
function getUserData(userId) {
    const userDocument = firestore.collection('volunteers');
    return userDocument
        .doc(userId)
        .get()
        .then((snapshot) => snapshot.data().name);
}

// Add Locations Data ->
function addLocationData(locations) {
    const locationDocument = firestore.collection('locations');
    locations.forEach((loc) => {
        console.log(loc['Coordinates']['Lat']);
        locationDocument.add(loc).then((res) => {
            locationDocument.doc(res.id).update({
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

// Fetch Location Data ->
function getLocationData(){
    var res = [];
    const locationDocument = firestore.collection('locations');
    locationDocument.onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
            res.push(doc.data());
        })
    })
    return res;
}


export { addUserData , getUserData, addLocationData, getLocationData };
