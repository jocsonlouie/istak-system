const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.newUserSignUp = functions.auth.user().onCreate((user) => {
    return admin.firestore().collection("users").doc(user.uid).set({
        email: user.email,
        name: user.displayName !== null ? user.displayName : "Clinic",
        avatar: user.photoURL !== null ? user.photoURL : "https://assumptaclinic.com/wp-content/uploads/2022/10/profile-icon-default.jpeg",
        role: "Non-Inventory Staff"
    });
});

exports.userDeleted = functions.auth.user().onDelete((user) => {
    const doc = admin.firestore().collection("users").doc(user.uid);
    return doc.delete();
});

exports.deleteUser = functions.https.onCall(async (data, context) => {
    try {
        await admin.auth().deleteUser(data);
        return { result: "User Successfully Deleted" };
    } catch (error) {
        return { result: "User Deletion Error: " + error };
    }
});

exports.createUser = functions.https.onCall(async (data, context) => {
    const body = data;
    const email = body.email;
    const password = body.password;
    const displayName = body.displayName;
    admin.auth().createUser({
        email: email,
        emailVerified: true,
        password: password,
        displayName: displayName,
        disabled: false,
    })
        .then((userRecord) => {
            return {
                result: "Successfully created user! UID: " + userRecord.uid
            };
        })
        .catch((error) => {
            return { result: "Failed to create user: " + error };
        });
});
