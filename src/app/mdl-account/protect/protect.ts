import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user-service';
import { IUsers } from '../../models/users';
import { CommonModule } from '@angular/common';
import { UserAuthService } from '../../shared/user-auth-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-protect',
  imports: [CommonModule, RouterModule],
  templateUrl: './protect.html',
  styleUrl: './protect.css'
})
export class Protect implements OnInit {

  public users!: IUsers[];
  public isLoged: boolean = false;

  constructor(private userService: UserService, private userAuthService: UserAuthService) {

  }

  ngOnInit(): void {
    this.userAuthService.isLoggedIn().subscribe(__isLoged => this.isLoged = __isLoged);
    this.userService.GetUsers().subscribe({
      next: response => { console.log(response);
        this.users = response},
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

}
