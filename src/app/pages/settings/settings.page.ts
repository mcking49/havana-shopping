import { TeamService } from './../../services/team.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import * as _ from 'lodash';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public teamUsers: User[]; // FIXME: convert to an observable to keep it synced with database.

  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private navCtrl: NavController,
    private userService: UserService,
  ) {
    this.teamUsers = [];
  }

  ngOnInit() {
    this.getTeamMembers();
  }

  /**
   * Check if the current user is a team admin.
   * @returns - `true` if the current user is an admin.
   */
  public get isCurrentUserAdmin(): boolean {
    return _.get(this.userService, 'currentUser.teamAdmin', false);
  }

  public async getTeamMembers() {
    const currentUser: User = await this.userService.getCurrentUser();
    this.teamUsers = await this.userService.getTeamUsers(currentUser.teamId);
  }

  public async logout(): Promise<void> {
    const confirmAlert = await this.alertCtrl.create({
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.authService.logout();
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });
    await confirmAlert.present();
  }

}
