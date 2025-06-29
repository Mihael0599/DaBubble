import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { LoginComponent } from "./login/login.component";
import { MainContentComponent } from './main-content/main-content.component';
import { HeaderComponent } from './main-content/header/header.component';

interface Item {
  name: string;
}

@Component({
  selector: 'app-root',
  imports: [
    LoginComponent,
    MainContentComponent,
    CommonModule,
    HeaderComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DaBubble';

  loginSuccess = true;

  firestore = inject(Firestore);
  itemCollection = collection(this.firestore, 'users');
  item$ = collectionData(this.itemCollection);
}
