import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

interface UserEmails {
  userEmails: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly userPath: string = 'admin/users';
  private userEmails: string[];

  constructor(private firestore: AngularFirestore) {
    this.firestore.doc<UserEmails>(this.userPath).valueChanges().subscribe((data: UserEmails) => {
      this.userEmails = data.userEmails;
    });
  }

  /**
   * Check if an email already exists.
   * @param email - The new email wanting to be added to the database.
   * @returns - `True` if the email already exists.
   */
  public checkEmailExists(email: string): boolean {
    return _.includes(this.userEmails, email);
  }

  /**
   * Add a new email to the list of emails.
   * @param email - The new email to add to the list.
   * @returns - Resolves when the transaction is complete.
   */
  public addNewEmail(email: string): Promise<void> {
    const userEmailsRef = this.firestore.doc<UserEmails>(this.userPath).ref;
    return this.firestore.firestore.runTransaction(async (transaction) => {
      this.userEmails.push(email);
      transaction.update(userEmailsRef, {userEmails: this.userEmails});
    });
  }

  /**
   * Delete an email from the database.
   * @param email - The email to be deleted.
   * @returns - Resolves when the transaction is complete.
   */
  public deleteEmail(email: string): Promise<void> {
    const userEmailsRef = this.firestore.doc<UserEmails>(this.userPath).ref;
    return this.firestore.firestore.runTransaction(async (transaction) => {
      transaction.update(userEmailsRef, {userEmails: _.pull(this.userEmails, email)});
    });
  }
}
