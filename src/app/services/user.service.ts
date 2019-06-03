import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { User } from './../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public currentUser: User;
  public currentUserSubscription: Subscription;

  private readonly createTeamUserRequestRootPath: string = 'createTeamUserRequest';
  private readonly userRootPath: string = 'user';
  private currentUserPath: string;

  constructor(private firestore: AngularFirestore) { }

  /**
   * Clear any stored data.
   */
  public clearData(): void {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
    this.currentUser = null;
    this.currentUserPath = null;
  }

  /**
   * Create a new team user.
   * @param firstname - The new user's first name.
   * @param lastname - The new user's last name.
   * @param email - The new user's email. This will be used for login.
   * @returns - Resolves when the new user has been created.
   */
  public async createTeamUser(firstname: string, lastname: string, email: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        // Only team admins can create team users. Therefore we can assume
        // that the the team user is being added to the current users
        // team and hence have the same teamId's.
        const teamId: string = this.currentUser.teamId;

        const user: User = {
          firstname,
          id: this.generateNewUserId(),
          lastname,
          email,
          teamAdmin: false,
          teamId
        };

        await this.firestore
          .doc<User>(`${this.createTeamUserRequestRootPath}/${user.id}`)
          .set(user);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Create a user object in the database.
   * @param user - The user object to create.
   * @returns - Resolves when the user creation completes.
   */
  public createUser(user: User): Promise<void> {
    return this.firestore.doc<User>(`${this.userRootPath}/${user.id}`).set(user);
  }

  /**
   * Generates a new unique ID.
   * @returns - The generated ID.
   */
  public generateNewUserId(): string {
    return this.firestore.createId();
  }

  /**
   * Load the current user.
   * @param userId - The ID of the current user.
   * @returns - Resolves when the user object has been loaded.
   */
  public async loadCurrentUser(userId: string): Promise<void> {
    this.currentUserPath = `${this.userRootPath}/${userId}`;
    await this.firestore
      .doc<User>(this.currentUserPath)
      .get()
      .toPromise()
      .then((value: DocumentSnapshot<User>) => {
        this.currentUser = value.data();
      });

    this.subscribeToUser();
  }

  /**
   * Subscribe to the user object.
   */
  private subscribeToUser(): void {
    this.currentUserSubscription = this.firestore
      .doc<User>(this.currentUserPath)
      .valueChanges()
      .subscribe((user: User) => {
        this.currentUser = user;
      });
  }
}
