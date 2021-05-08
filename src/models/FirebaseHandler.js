import { firestore } from './firebase';
import firebase from 'firebase/app';

// Create New User ->
function addUserData(userId, name, email, contact){
    const userDocument = firestore.collection('volunteers');
    userDocument.doc(userId).set({
        volunteer_id : userId,
        name : name,
        email : email,
        contact : contact,
        tasks_assigned : [],
        tasks_completed : 0,
        type : "On-Call Activist"
    })
}

// Add Locations Data ->
function addLocationData(locations){
    const locationDocument = firestore.collection('locations');
    locations.forEach((loc) =>{
        console.log(loc['Coordinates']['Lat']);
        locationDocument.add(loc)
        .then(res =>{
            locationDocument.doc(res.id).update({
                Coordinates : new firebase.firestore.GeoPoint(
                    loc['Coordinates']['Lat'] ? loc['Coordinates']['Lat'] : 0 ,
                    loc['Coordinates']['Long'] ? loc['Coordinates']['Long'] : 0
                )
            })
        })
    })
    console.log('Insertion Sucesssfull');

}

export {addUserData, addLocationData};