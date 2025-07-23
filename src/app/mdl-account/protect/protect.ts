import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user-service';
import { IApiResponse, IDeleteUserDataRequestModel, IUpdateUserDataRequestModel, IUsers } from '../../models/users';
import { CommonModule } from '@angular/common';
import { UserAuthService } from '../../shared/user-auth-service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../mdl-auth/auth-service';
import { AlertService } from '../../alert/alert-service';
import { Update } from '../update/update';
import { openModalById } from '../../util/modal.util';
import { ReactiveFormsModule } from '@angular/forms';
import { Delete } from '../delete/delete';

@Component({
  selector: 'app-protect',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, Update, Delete],
  templateUrl: './protect.html',
  styleUrl: './protect.css'
})
export class Protect implements OnInit {

  public users!: IUsers[];
  public isLoged: boolean = false;
  public selectUser!: IUsers;

  constructor(private userService: UserService,
    private userAuthService: UserAuthService,
    private authService: AuthService,
    private alertService: AlertService) {

  }

  ngOnInit(): void {
    this.userAuthService.isLoggedIn().subscribe(__isLoged => this.isLoged = __isLoged);
    this.userService.GetUsers().subscribe({
      next: response => {
        console.log(response);
        this.users = response
      },
      error: err => {
        console.log(err)
      }
    });
  }

  Logout() {
    this.userAuthService.clearToken();
  }

  ChangeTextGender(gender: string) {
    return gender.toUpperCase() == 'M' ? 'Masculino' : 'Feminino';
  }

  SelectedItem(row: any) {
    this.selectUser = row;
  }

  openViewUserModal(item: any, event?: any) {
    this.selectUser = item;
    openModalById('update_user_modal');
  }

  onSubmitUpdateUser(command: any) {
    this.userService.updateUser(command.userId, command.data).subscribe({
      next: (value: IApiResponse<any>) => {
        if (value.success) {
          this.alertService.success('Usuário atualizado com sucesso.');
          this.userService.GetUsers().subscribe({
            next: response => {
              this.users = response
            },
            error: err => {
              console.log(err)
            }
          });
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
        this.alertService.error('Falha ao editar usuário, verifique os dados e tente novamente.');
      }
    })
  }

  openDeleteUserModal(item: any, event?: Event) {
    if (event) event.stopPropagation();
    this.selectUser = item;
    openModalById('delete_user_modal');
  }

  onSubmiDeleteUser(command: IDeleteUserDataRequestModel) {
    this.userService.deleteUser(command).subscribe({
      next: (value: IApiResponse<any>) => {
        if (value.success) {
          this.alertService.success('Usuário excluído com sucesso.');
          this.userService.GetUsers().subscribe({
            next: response => {
              this.users = response
            },
            error: err => {
              console.log(err)
            }
          });
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
        this.alertService.error('Falha ao excluir usuário, tente novamente.');
      }
    })
  }

  loadImage(item: string) {
    if(item == null || item == undefined || item == '') {
      return "assets/SemFoto.jpg";
    } else {
      return `data:image/jpeg;base64,${item}`;
    }
  }

}
