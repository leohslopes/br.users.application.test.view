import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IDeleteUserDataRequestModel, IUsers } from '../../models/users';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../mdl-auth/auth-service';
import { AlertService } from '../../alert/alert-service';
import { UserAuthService } from '../../shared/user-auth-service';
import { closeModalById } from '../../util/modal.util';
import { CommonModule } from '@angular/common';

const _modalId = 'delete_user_modal';
@Component({
  selector: 'app-delete',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './delete.html',
  styleUrl: './delete.css'
})
export class Delete implements OnChanges, OnInit {
  @Input() users!: IUsers;
  @Output() onSubmit: EventEmitter<IDeleteUserDataRequestModel> = new EventEmitter();
  userFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private userAuthService: UserAuthService) {
    this.userFormGroup = this.formBuilder.group({
      userID: ['', [Validators.required]],
      userName: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {
    if (!this.users) return;
    this.#loadUserData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.users) return;
    this.#loadUserData();
  }

  #loadUserData() {
    this.userFormGroup.patchValue({
      userID: this.users.userID,
      userName: this.users.userName
    });
  }

  deleteUser() {
    this.userFormGroup.markAllAsTouched();

    if (!this.userFormGroup.valid) return;

    const formData = this.userFormGroup.value;
    const command = {
      userID: parseInt(formData.userID)
    } as IDeleteUserDataRequestModel;

    this.onSubmit.emit(command);
    this.closeModal();
  }

  closeModal() {
    this.userFormGroup.reset();
    closeModalById(_modalId);
  }
}
