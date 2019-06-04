import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { ToastService } from './../../services/toast.service';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private formbuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private toastService: ToastService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.initLoginForm();
  }

  /**
   * Attempt to login to the app.
   * @returns - Resolves when it has finished trying to login.
   */
  public async login(): Promise<void> {
    if (this.loginForm.valid) {
      const loading = await this.loadingCtrl.create();
      loading.present();
      try {
        const email: string = this.loginForm.value.email;
        const password: string = this.loginForm.value.password;
        await this.authService.login(email, password);
        this.navCtrl.navigateRoot('/tabs');
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          this.toastService.showInfoToast('Your email or password is incorrect.');
        } else {
          console.error(error);
        }
      } finally {
        loading.dismiss();
      }
    } else {
      this.toastService.showInfoToast('Error: email or password is invalid.');
    }
  }

  /**
   * Initialise the login form.
   */
  private initLoginForm(): void {
    this.loginForm = this.formbuilder.group({
      email: [
        '',
        Validators.compose([Validators.email, Validators.required])
      ],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ]
    });
  }

}
