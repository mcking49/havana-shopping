import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Team } from '../interfaces/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  public currentTeam: Team;

  private readonly teamRootPath: string = 'team';
  private currentTeamPath: string;
  private currentTeamSubscription: Subscription;

  constructor(private firestore: AngularFirestore) { }

  /**
   * Clear the stored data.
   */
  public clearData(): void {
    if (this.currentTeamSubscription) {
      this.currentTeamSubscription.unsubscribe();
    }
    this.currentTeam = null;
    this.currentTeamPath = null;
  }

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

  /**
   * Load the current Team.
   * @param teamId - The current team's ID.
   * @returns - Resolves when the current team is loaded.
   */
  public async loadCurrentTeam(teamId: string): Promise<void> {
    this.currentTeamPath = `${this.teamRootPath}/${teamId}`;
    await this.firestore
      .doc<Team>(this.currentTeamPath)
      .get()
      .toPromise()
      .then((team: DocumentSnapshot<Team>) => {
        this.currentTeam = team.data();
      });

    this.subscribeToTeam();
  }

  /**
   * Subscribe to the current team.
   */
  private subscribeToTeam(): void {
    this.currentTeamSubscription = this.firestore
      .doc<Team>(this.currentTeamPath)
      .valueChanges()
      .subscribe((team: Team) => {
        this.currentTeam = team;
      });
  }
}
