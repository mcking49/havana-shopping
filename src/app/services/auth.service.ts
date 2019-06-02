import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

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
}
