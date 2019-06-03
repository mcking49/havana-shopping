import { UserService } from 'src/app/services/user.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  /**
   * Check if the current user is a team admin.
   * @returns - `true` if the current user is an admin.
   */
  public get isCurrentUserAdmin(): boolean {
    return _.get(this.userService, 'currentUser.teamAdmin', false);
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
            this.router.navigateByUrl('/login');
          }
        }
      ]
    });
    await confirmAlert.present();
  }

}
