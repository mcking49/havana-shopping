import { User } from './../interfaces/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly userRootPath: string = 'user';

  constructor(private firestore: AngularFirestore) { }

  /**
   * Create a user object in the database.
   * @param user - The user object to create.
   * @returns - Resolves when the user creation completes.
   */
  public createUser(user: User): Promise<void> {
    return this.firestore.doc<User>(`${this.userRootPath}/${user.id}`).set(user);
  }
}
