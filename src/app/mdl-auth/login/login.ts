import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { AlertService } from '../../alert/alert-service';
import { UserAuthService } from '../../shared/user-auth-service';
import { Router } from '@angular/router';
import { openModalById } from '../../util/modal.util';
import { Registern } from '../registern/registern';
import { IApiResponse, IItemUserDataRequestModel } from '../../models/users';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, Registern],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private userAuthService: UserAuthService,
    private router: Router) {
    this.loginFormGroup = this.formBuilder.group({
      userEmail: ['', [Validators.required, Validators.maxLength(150)]],
      userPassword: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  login() {
    this.authService.login(this.loginFormGroup.getRawValue()).subscribe({
      next: (value) => {
        if (value) {
          this.alertService.success('Usuário logado com sucesso.');
          this.userAuthService.setToken(value.data.token);
          this.userAuthService.setUser(value.data.user);
          this.router.navigateByUrl('account/protect');
        }
      },
      error: (err) => {
        this.alertService.error('Falha ao autenticar, verifique os dados e tente novamente.');
      }
    })
  }

  openCreateUserModal() {
      openModalById('create_user_modal');
    }

  onSubmitCreateUser(command: IItemUserDataRequestModel) {
      this.authService.register(command).subscribe({
      next: (value: IApiResponse<any>) => {
        if (value.success) {
          this.alertService.success('Usuário criado com sucesso.');
        } else {
          const errosObj = value.errors as Record<string, any>;

          // Extrai apenas os valores (as mensagens) e gera um array de strings
          const listaDeErros: string[] = Object.values(errosObj).map(err => {
            // Se for um array ou objeto mais complexo, adapte aqui
            if (Array.isArray(err)) return err.join(', ');
            if (typeof err === 'string') return err;
            return JSON.stringify(err);
          });

          // Agrupa tudo numa única string
          const mensagemUnica = listaDeErros.join('; ');
          this.alertService.error(mensagemUnica);
        }
      },
      error: (err) => {
        this.alertService.error('Falha ao criar usuário, verifique os dados e tente novamente.');
      }
    })
    }


}
