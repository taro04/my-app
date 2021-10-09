import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewHomeComponent } from './views/home/home.component';
import { AccountComponent } from './pages/account/account.component';

const routes: Routes = [
  {
    path: '',
    component: ViewHomeComponent,
  },
  {
    path: 'accounts/:address',
    component: AccountComponent,
  },
  //{ path: '', loadChildren: () => import('./pages/home/home.module').then((m) => m.AppHomeModule) },
  //lazyLoading
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
