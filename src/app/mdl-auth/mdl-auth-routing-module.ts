import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Registern } from './registern/registern';

const routes: Routes = [ {
  path: '', 
  children: [ 
    {
      path: 'login',
      component: Login
    },
    {
      path: 'register',
      component: Registern
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MdlAuthRoutingModule { }
