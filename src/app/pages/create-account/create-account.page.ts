import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { Passwords } from './../../validators/passwords';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  public createAccountForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formbuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.initCreateAccountForm();
  }

  /**
   * The passwords form group.
   * @returns - The `passwords` form group.
   */
  public get passwords(): FormGroup {
    return this.createAccountForm.get('passwords') as FormGroup;
  }

  /**
   * Create an account.
   * @returns - Resolves when the account has been created.
   */
  public async createAccount(): Promise<void> {
    if (this.createAccountForm.valid) {
      const loading = await this.loadingCtrl.create();
      loading.present();

      const firstname: string = this.createAccountForm.value.firstname;
      const lastname: string = this.createAccountForm.value.lastname;
      const email: string = this.createAccountForm.value.email;
      const password: string = this.passwords.value.password;

      try {
        await this.authService.createAdminUser(firstname, lastname, email, password);
        this.router.navigateByUrl('/tabs');
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          this.toastService.showInfoToast(`ERROR: ${error.message}`);
        } else {
          console.error(error);
        }
      } finally {
        loading.dismiss();
      }
    } else {
      this.toastService.showInfoToast('ERROR: The form is invalid. Please check your details.');
    }
  }

  /**
   * Initialise the `create account` form.
   */
  private initCreateAccountForm(): void {
    this.createAccountForm = this.formbuilder.group({
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
      ],
      passwords: this.formbuilder.group({
        password: [
          '',
          Validators.compose([Validators.minLength(6), Validators.required])
        ],
        confirmPassword: [
          '',
          Validators.compose([Validators.minLength(6), Validators.required])
        ]
      },
      {validator: Passwords.MatchPassword})
    });
  }

}
