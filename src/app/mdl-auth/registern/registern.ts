import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IApiResponse, IItemUserDataRequestModel } from '../../models/users';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service';
import { AlertService } from '../../alert/alert-service';
import { closeModalById, cpfValidator, passwordPolicyValidator } from '../../util/modal.util';
import { UserAuthService } from '../../shared/user-auth-service';

const _modalId = 'create_user_modal';
@Component({
  selector: 'app-registern',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registern.html',
  styleUrl: './registern.css'
})
export class Registern implements OnInit {

  userFormGroup!: FormGroup;
  @Output() onSubmit: EventEmitter<IItemUserDataRequestModel> = new EventEmitter();
  public isLoged: boolean = false;
  public idRegister: string = '';
  public showPassword = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private alertService: AlertService, private userAuthService: UserAuthService) {
    this.userFormGroup = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.maxLength(80)]],
      userEmail: ['', [Validators.required, Validators.maxLength(50)]],
      userAge: [null, [Validators.required, Validators.min(1)]],
      userGender: ['', [Validators.required]],
      userPassword: ['', [Validators.required, Validators.maxLength(8), passwordPolicyValidator]],
      userOfficialNumber: ['', [Validators.required, Validators.maxLength(14),cpfValidator]]
    });
  }

  ngOnInit(): void {
   this.userAuthService.isLoggedIn().subscribe(__isLoged => this.isLoged = __isLoged);
  }

  insertUser() {
    this.userFormGroup.markAllAsTouched();

    if (!this.userFormGroup.valid) return;

    const formData = this.userFormGroup.value;
    const command = {
      userName: formData.userName,
      userEmail: formData.userEmail,
      userAge: parseInt(formData.userAge),
      userGender: formData.userGender,
      userPassword: formData.userPassword,
      userOfficialNumber: formData.userOfficialNumber
    } as IItemUserDataRequestModel;

    this.onSubmit.emit(command);
    this.closeModal();
  }

  closeModal() {
    this.userFormGroup.reset();
    this.userAuthService.clearToken();
    closeModalById(_modalId);
  }

  formatRegister(event: any) {
  let value = event.target.value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  this.idRegister = value;
}

checkedPassword(el: any) {
  this.showPassword = el.target.checked;
}


}
