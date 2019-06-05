import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as _ from 'lodash';
admin.initializeApp()

/**
 * Create user records for a new team user.
 *
 * When the app creates a request to create a new user, this function will
 * create an auth credential for the user, a user profile object, and add the user
 * to the members list of the the team they belong to. Then the request is deleted from
 * the requests document.
 */
exports.createTeamUserRequest = functions.firestore
  .document('createTeamUserRequest/{userId}')
  .onCreate(async (snapshot) => {
    // Get the data from the request.
    const user: any = snapshot.data();
    const displayName: string = `${user.firstname} ${user.lastname}`;
    const email: string = user.email;
    const password: string = '121212';

    // Create promise to create auth user.
    const createUserAuthPromise: Promise<any> = admin.auth().createUser({
      uid: user.id,
      displayName,
      email,
      password
    });

    // Create promise for creating the user object.
    const createUserObjectPromise: Promise<any>
      = admin.firestore().doc(`user/${user.id}`).set(user);

    // Get the current team members list.
    const team = await admin.firestore().doc(`team/${user.teamId}`).get()
    const members: string[] = team.get('members');
    members.push(user.id);

    // Create promise for updating the current team list.
    const updateTeamMembersPromise: Promise<any>
      = admin.firestore().doc(`team/${user.teamId}`).update({members});

    // Create promise to delete the create team user request.
    const deleteCreateTeamUserRequestPromise: Promise<any>
      = admin.firestore().doc(`createTeamUserRequest/${user.id}`).delete();

    // Finally, execute all promises.
    return Promise.all([
      createUserAuthPromise,
      createUserObjectPromise,
      updateTeamMembersPromise,
      deleteCreateTeamUserRequestPromise,
    ]);
  });

/**
 * Add the new user to the admin list of users.
 */
exports.addNewUserToAdminList = functions.firestore
  .document('user/{userId}')
  .onCreate(async (snapshot) => {
    const email: string = snapshot.get('email');;


    const userEmailsRef = admin.firestore().doc('admin/users');

    return admin.firestore().runTransaction(async (transaction) => {
      const currentEmailListSnapshot = await admin.firestore().doc('admin/users').get();
      const emailList: string[] = currentEmailListSnapshot.get('userEmails');
      emailList.push(email);
      transaction.update(userEmailsRef, {userEmails: emailList});
    });
  });

/**
 * Delete a user from the admin list of users.
 */
exports.removeUserFromAdminList = functions.firestore
  .document('user/{userId}')
  .onDelete(async (snapshot) => {
    const email: string = snapshot.get('email');

    const userEmailsRef = admin.firestore().doc('admin/users');

    return admin.firestore().runTransaction(async (transaction) => {
      const currentEmailListSnapshot = await admin.firestore().doc('admin/users').get();
      const emailList: string[] = currentEmailListSnapshot.get('userEmails');
      transaction.update(userEmailsRef, {userEmails: _.pull(emailList, email)});
    });
  });
