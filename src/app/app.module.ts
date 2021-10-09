import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { ViewHomeComponent } from './views/home/home.component';
import { HomeComponent } from './pages/home/home.component';



@NgModule
({
  declarations: [
    AppComponent,
    HomeComponent,
    ViewHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
