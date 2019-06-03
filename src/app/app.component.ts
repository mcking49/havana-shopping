import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthService } from './services/auth.service';
import { TeamService } from './services/team.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private swUpdate: SwUpdate,
    private teamService: TeamService,
    private userService: UserService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.checkLoggedInState();
    this.checkServiceWorker();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  /**
   * Check the `loggedIn` state of the app.
   * @returns - Resolves when the check is complete.
   */
  private async checkLoggedInState(): Promise<void> {
    const isLoggedIn: boolean = await this.authService.isLoggedIn();
    if (isLoggedIn) {
      await this.userService.loadCurrentUser(this.authService.currentUser.uid);
      this.teamService.loadCurrentTeam(this.userService.currentUser.teamId);
    }
  }

  /**
   * Check if the service worker is listening and subscribe to updates.
   */
  private checkServiceWorker(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(async () => {
        const alert = await this.alertCtrl.create({
          header: 'App update!',
          message: 'A new update is available, do you want to download it now?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'medium'
            },
            {
              text: 'Yes',
              handler: () => {
                window.location.reload();
              }
            }
          ]
        });
        await alert.present();
      });
    }
  }
}
