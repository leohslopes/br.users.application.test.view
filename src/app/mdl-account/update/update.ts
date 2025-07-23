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

export class Update implements OnChanges, OnInit {


  @Input() users!: IUsers;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  userFormGroup!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private userAuthService: UserAuthService) {
    this.userFormGroup = this.formBuilder.group({
      userID: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.maxLength(80)]],
      userEmail: ['', [Validators.required, Validators.maxLength(50)]],
      userAge: [null, [Validators.required, Validators.min(1)]],
      userGender: ['', [Validators.required]],
      userPassword: ['', [Validators.required, Validators.maxLength(200)]],
      userPicture: [null]
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
      userPassword: this.users.userPassword,
      userPicture: this.users.userPicture
    });
  }

  updateUser() {
    this.userFormGroup.markAllAsTouched();
    if (this.userFormGroup.invalid) return;

    const fv = this.userFormGroup.value;
    const formData = new FormData();

    // campos de texto / número
    formData.append('userID', fv.userID.toString());
    formData.append('userName', fv.userName);
    formData.append('userEmail', fv.userEmail);
    formData.append('userAge', fv.userAge.toString());
    formData.append('userGender', fv.userGender);
    formData.append('userPassword', fv.userPassword);

    // campo de imagem (só anexa se for realmente um File)
    const pic = fv.userPicture;
    if (pic instanceof File) {
      formData.append('userPicture', pic, pic.name);
    } else {
      console.warn('userPicture não é um File válido:', pic);
    }

    // agora emite o FormData, não mais o JSON puro
    this.onSubmit.emit({userId: fv.userID, data: formData});
    this.closeModal();

  }

  closeModal() {
    this.userFormGroup.reset();
    closeModalById(_modalId);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    // aqui sim você armazena o File no FormControl
    this.userFormGroup.patchValue({ userPicture: file });
    this.userFormGroup.get('userPicture')!.updateValueAndValidity();
  }

}
