const functions = require("firebase-functions");
const admin = require("firebase-admin");
const accountSid = functions.config().twiliokeys.sid;
const authToken = functions.config().twiliokeys.token;
const client = require("twilio")(accountSid, authToken);
const emailjs = require("@emailjs/browser");

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const docRef = admin.firestore().collection("inventory");

exports.newUserSignUp = functions.auth.user().onCreate((user) => {
    return admin.firestore().collection("users").doc(user.uid).set({
        email: user.email,
        name: user.displayName !== null ? user.displayName : "Clinic",
        avatar: user.photoURL !== null ? user.photoURL : "https://assumptaclinic.com/wp-content/uploads/2022/10/profile-icon-default.jpeg",
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

exports.scheduledFunctionCrontab = functions.pubsub.schedule("30 0 * * *")
    .timeZone("Asia/Manila")
    .onRun((context) => {
        let arrayR = [];
        var templateParams = {
            toEmail: "info@assumptaclinic.com",
            fromEmail: "assumptadogandcatclinic@gmail.com",
            message: "Reminder: Low stock and item expiry notification. From ISTAK IMS"
        };
        docRef.get()
            .then(snapshot => {
                arrayR = snapshot.docs.map(doc => {
                    return doc.data();
                });
                if (arrayR.length !== 0) {
                    client.messages
                        .create({
                            body: "Reminder: Low stock and item expiry notification. From ISTAK IMS",
                            messagingServiceSid: functions.config().twiliokeys.msgsid,
                            to: "+639274665823"
                        })
                        .then((message) => console.log(message.sid))
                        .done();

                    emailjs
                        .sendForm(
                            "service_cky0y6t",
                            "template_2zs8qew",
                            templateParams,
                            "9aetr9pH3Vj0_P8yK"
                        )
                        .then(
                            (result) => {
                                console.log("SUCCESS!", result.text);
                            },
                            (error) => {
                                console.log("FAILED...", error.text);
                            }
                        );
                }
            }).catch(function (error) {
                console.log("got an error", error);
            });

        return null;

    });

