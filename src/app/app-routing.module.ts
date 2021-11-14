import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AccountComponent } from './pages/account/account.component';

//import { Link1Component } from './views/link1/link1.component';
//import { MyDashboardComponent } from './views/my-dashboard/my-dashboard.component'
import { Link3Component } from './views/link3/link3.component';

const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'accounts/:address', component: AccountComponent, },
 // { path: 'dashboard', component: MyDashboardComponent },
  { path: 'link3', component: Link3Component, },
  //{ path: '', loadChildren: () => import('./pages/home/home.module').then((m) => m.AppHomeModule) },
  //lazyLoading
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
