import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-team-user',
  templateUrl: './create-team-user.page.html',
  styleUrls: ['./create-team-user.page.scss'],
})
export class CreateTeamUserPage implements OnInit {

  public userForm: FormGroup;

  constructor(
    private formbuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initUserForm();
  }

  public createTeamUser() {
    console.log('--- create team user');
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
