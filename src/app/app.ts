import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { IApiResponse, IItemUserDataRequestModel, IUsers } from './models/users';
import { UserService } from './user-service';
import { CommonModule } from '@angular/common';
import { openModalById } from './util/modal.util';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './alert/alert-service';
import { UserAuthService } from './shared/user-auth-service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, AlertComponent, RouterModule],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  public users!: IUsers[];
  public alertMsg: {
    type: 'success' | 'error';
    msg: string;
  }[] = [];
  public isLoged: boolean = false;

  constructor(private userService: UserService, private alertService: AlertService, private userAuthService: UserAuthService) {

  }


  protected readonly title = signal('br.users.application.test.view');


  ngOnInit(): void {
    this.userAuthService.isLoggedIn().subscribe(__isLoged => this.isLoged = __isLoged);
  }

  logout() {
    this.userAuthService.clearToken();
  }
}
