import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user-service';
import { IApiResponse, IDeleteUserDataRequestModel, IFilterUsersRequestModel, IResultSetImportArchive, IUpdateUserDataRequestModel, IUsers } from '../../models/users';
import { CommonModule } from '@angular/common';
import { UserAuthService } from '../../shared/user-auth-service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../mdl-auth/auth-service';
import { AlertService } from '../../alert/alert-service';
import { Update } from '../update/update';
import { openModalById } from '../../util/modal.util';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Delete } from '../delete/delete';
import { NonNullAssert } from '@angular/compiler';

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
  public filterFormGroup!: FormGroup;
  public currentPage: number = 1;
  public usersPerPage: number = 10;

  constructor(private userService: UserService,
    private userAuthService: UserAuthService,
    private authService: AuthService,
    private alertService: AlertService,
    private formBuilder: FormBuilder) {
    this.filterFormGroup = this.formBuilder.group({
      filterName: [null],
      filterEmail: [null],
      filterImg: [null]
    });
  }

  ngOnInit(): void {
    this.userAuthService.isLoggedIn().subscribe(__isLoged => this.isLoged = __isLoged);
    this.search();
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
          this.search();
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
    });
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
          this.search();
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
    });
  }

  loadImage(item: string) {
    if (item == null || item == undefined || item == '') {
      return "assets/SemFoto.jpg";
    } else {
      return `data:image/jpeg;base64,${item}`;
    }
  }

  search() {
    this.filterFormGroup.markAllAsTouched();

    const formData = this.filterFormGroup.value;
    const command = {
      filterName: formData.filterName,
      filterEmail: formData.filterEmail,
      filterImg: formData.filterImg
    } as IFilterUsersRequestModel;

    this.userService.GetUsers(command).subscribe({
      next: response => {
        console.log(response);
        this.users = response
      },
      error: err => {
        console.log(err)
      }
    });
  }

  clear() {
    this.filterFormGroup = this.formBuilder.group({
      filterName: [null],
      filterEmail: [null],
      filterImg: [null]
    });

    this.search();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.userService.import(formData).subscribe({
      next: (value: IApiResponse<IResultSetImportArchive>) => {
        if (value.success) {
          const base64 = value.data.resultFileContent;
          const blob = this.base64ToBlob(base64, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          const a = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = 'resultado-importacao.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);


          if (value.data.countRows > 0) {
            this.alertService.success(`Usuário(s) ${value.data.countRows} importado(s) com sucesso.`);
          } else {
            this.alertService.warning('Existe(m) crítica(s) na planilha de retorno.');
          }

          this.search();
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
        this.alertService.error('Falha ao importar a planilha, verifique e tente novamente.');
      }
    });
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.usersPerPage;
    return this.users.slice(start, start + this.usersPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.usersPerPage);
  }
}
