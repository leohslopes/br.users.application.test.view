import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IUpdateUserDataRequestModel, IUsers } from '../../models/users';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../mdl-auth/auth-service';
import { AlertService } from '../../alert/alert-service';
import { UserAuthService } from '../../shared/user-auth-service';
import { closeModalById } from '../../util/modal.util';
import { CommonModule } from '@angular/common';

const _modalId = 'update_user_modal';
@Component({
  selector: 'app-update',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update.html',
  styleUrl: './update.css'
})

export class Update implements OnChanges,OnInit {


  @Input() users!: IUsers;
  @Output() onSubmit: EventEmitter<IUpdateUserDataRequestModel> = new EventEmitter();
  userFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private userAuthService: UserAuthService) {
    this.userFormGroup = this.formBuilder.group({
      userID: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.maxLength(50)]],
      userEmail: ['', [Validators.required, Validators.maxLength(150)]],
      userAge: [null, [Validators.required, Validators.min(1)]],
      userGender: ['', [Validators.required]],
      userPassword: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }
  ngOnInit(): void {
    if (!this.users) return;
    this.#loadUserData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.users) return;
    this.#loadUserData();
    //this.userFormGroup.disable();
  }

  #loadUserData() {
    this.userFormGroup.patchValue({
      userID: this.users.userID,
      userName: this.users.userName,
      userEmail: this.users.userEmail,
      userAge: this.users.userAge,
      userGender: this.users.userGender,
      userPassword: this.users.userPassword
    });
  }

  updateUser() {
    this.userFormGroup.markAllAsTouched();

    //if (!this.userFormGroup.valid || !this.userFormGroup.dirty) return;

    const formData = this.userFormGroup.value;
    const command = {
      userID: parseInt(formData.userID),
      userName: formData.userName,
      userEmail: formData.userEmail,
      userAge: parseInt(formData.userAge),
      userGender: formData.userGender,
      userPassword: formData.userPassword
    } as IUpdateUserDataRequestModel;

    this.onSubmit.emit(command);
    this.closeModal();
  }

  closeModal() {
    this.userFormGroup.reset();
    closeModalById(_modalId);
  }

}
