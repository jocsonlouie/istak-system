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
