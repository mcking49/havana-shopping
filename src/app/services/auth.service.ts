import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { TeamService } from './team.service';
import { UserService } from './user.service';

import { Team } from './../interfaces/team';
import { User } from './../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private teamService: TeamService,
    private userService: UserService
  ) { }

  /**
   * Create an admin user.
   * @param firstname - The user's firstname.
   * @param lastname - The user's lastname.
   * @param email - The user's email.
   * @param password - The user's login password.
   * @returns - Resolves when the admin user has been created.
   */
  public async createAdminUser(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const userCredential: firebase.auth.UserCredential = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
        const teamId: string = this.teamService.generateNewTeamId();
        const user: User = {
          email,
          firstname,
          id: userCredential.user.uid,
          lastname,
          teamAdmin: true,
          teamId
        };
        const createUserPromise: Promise<void> = this.userService.createUser(user);

        const team: Team = {
          id: teamId,
          admin: user.id,
          members: [user.id],
        };
        const createTeamPromise: Promise<void> = this.teamService.createTeam(team);

        await Promise.all([createUserPromise, createTeamPromise]);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Check if there is a user logged in.
   * @returns - Resolves `true` if the user is logged in.
   */
  public isLoggedIn(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.afAuth.user.subscribe((user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  /**
   * Login to the app with an email and password.
   * @param email - The email to login in with.
   * @param password - The password to login with.
   * @returns - Resolves when the login attempt has finished.
   */
  public login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Logout of the app.
   * @returns - Resolves when the user is logged out.
   */
  public logout(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  /**
   * Send a reset password link to an email account.
   * @param email - The email to send a reset password link to.
   * @returns - Resolves when the links has been sent.
   */
  public sendResetPasswordLink(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
