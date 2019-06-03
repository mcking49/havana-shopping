import { AbstractControl } from '@angular/forms';

export class Passwords {

  /**
   * Validate that the password and confirmPassword controls are matching.
   *
   * @param control - The form control to apply this validator too.
   */
  public static MatchPassword(control: AbstractControl): null | void {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmPassword').value;

    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({confirmPassword: true});
    } else {
      return null;
    }
  }
}
