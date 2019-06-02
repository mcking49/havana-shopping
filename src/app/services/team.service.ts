import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Team } from '../interfaces/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private readonly teamRootPath: string = 'team';

  constructor(private firestore: AngularFirestore) { }

  /**
   * Create a team.
   * @param team - The team to create.
   * @returns - Resolves when the team is created.
   */
  public createTeam(team: Team): Promise<void> {
    return this.firestore.doc<Team>(`${this.teamRootPath}/${team.id}`).set(team);
  }

  /**
   * Generates a new unique ID.
   * @returns - The generated ID.
   */
  public generateNewTeamId(): string {
    return this.firestore.createId();
  }
}
