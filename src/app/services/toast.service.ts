import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl: ToastController) { }

  /**
   * Show a simple info toast with a custom message.
   * @param message - The message to be displayed on the toast.
   * @returns - Resolves when the toast is displayed.
   */
  public async showInfoToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    return toast.present();
  }

}
