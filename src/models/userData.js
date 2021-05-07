import { firestore } from './firebase';

// Create New User ->
function addData(userId, name, email, contact){
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

export {addData}