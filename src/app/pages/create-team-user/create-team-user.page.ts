import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';

import { ToastService } from './../../services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-team-user',
  templateUrl: './create-team-user.page.html',
  styleUrls: ['./create-team-user.page.scss'],
})
export class CreateTeamUserPage implements OnInit {

  public userForm: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toastService: ToastService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.initUserForm();
  }

  /**
   * Create the team user.
   * @returns - Resolves when the create team user request has completed.
   */
  public async createTeamUser(): Promise<void> {
    if (this.userForm.valid) {
      const loading = await this.loadingCtrl.create();
      loading.present();
      const firstname: string = this.userForm.value.firstname;
      const lastname: string = this.userForm.value.lastname;
      const email: string = this.userForm.value.email;
      try {
        await this.userService.createTeamUser(firstname, lastname, email);
        this.navCtrl.pop();
        this.toastService.showInfoToast('The new user has been added to the team!');
      } catch (error) {
        console.error(error);
      } finally {
        loading.dismiss();
      }
    } else {
      this.toastService.showInfoToast('ERROR: The entered details are invalid.');
    }
  }

  /**
   * Initialise the user form.
   */
  private initUserForm(): void {
    this.userForm = this.formbuilder.group({
      firstname: [
        '',
        Validators.required
      ],
      lastname: [
        '',
        Validators.required
      ],
      email: [
        '',
        Validators.compose([Validators.email, Validators.required])
      ]
    });
  }

}
