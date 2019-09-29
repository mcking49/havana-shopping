import { AuthService } from './../../services/auth.service';
import { LoadingController, NavController } from '@ionic/angular';
import { ToastService } from './../../services/toast.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  public forgotPasswordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formbuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.initForgotPasswordForm();
  }

  /**
   * Send a reset password link to the provided email.
   * @returns - Resolves when the link has been sent.
   */
  public async sendResetPasswordLink(): Promise<void> {
    if (this.forgotPasswordForm.valid) {
      const loading = await this.loadingCtrl.create();
      loading.present();
      const email: string = this.forgotPasswordForm.value.email;
      try {
        await this.authService.sendResetPasswordLink(email);
        this.toastService.showInfoToast('An email with a link to reset your password has been sent to you');
        this.navCtrl.pop();
      } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
          this.showInvalidEmailToast();
        } else {
          console.error(error);
        }
      } finally {
        loading.dismiss();
      }
    } else {
      this.showInvalidEmailToast();
    }
  }

  /**
   * Initialise the forgot password form.
   */
  private initForgotPasswordForm(): void {
    this.forgotPasswordForm = this.formbuilder.group({
      email: [
        '',
        Validators.compose([Validators.email, Validators.required])
      ]
    });
  }

  /**
   * Show an invalid email error toast.
   */
  private showInvalidEmailToast(): void {
    this.toastService.showInfoToast('ERROR: Please enter a valid email address');
  }

}
