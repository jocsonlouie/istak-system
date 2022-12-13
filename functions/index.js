const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(functions.config().sendgridapi.key);

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const docRef = admin.firestore().collection("inventory");

exports.newUserSignUp = functions.auth.user().onCreate((user) => {
    return admin.firestore().collection("users").doc(user.uid).set({
        email: user.email,
        name: user.displayName !== null ? user.displayName : "Clinic",
        avatar: user.photoURL !== null ? user.photoURL : "https://assumptaclinic.com/wp-content/uploads/2022/10/profile-icon-default.jpeg",
        phoneNumber: user.phoneNumber,
        role: "Can't Access"
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
    const phoneNumber = body.phoneNumber;
    const displayName = body.displayName;
    admin.auth().createUser({
        phoneNumber: phoneNumber,
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

exports.scheduledFunctionCrontab = functions.pubsub.schedule("0 7 * * *")
    .timeZone("Asia/Manila")
    .onRun((context) => {
        let arrayR = [];
        const msg = {
            to: "assumptadogandcatclinic@gmail.com",
            from: "info@assumptaclinic.com",
            subject: "Stock and Low Expiry Notification",
            text: "Reminder: Low stock and item expiry notification.",
            html: "Greetings!<br><br> <strong> Reminder: Low stock and item expiry notification.</strong> <br><br> From ISTAK IMS",
        };
        docRef.get()
            .then((snapshot) => {
                arrayR = snapshot.docs.map((doc) => {
                    return doc.data();
                });

                if (arrayR.length !== 0) {
                    sgMail
                        .send(msg)
                        .then(() => {
                            console.log("Email sent");
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            }).catch(function (error) {
                console.log("got an error", error);
            });
        return null;
    });
