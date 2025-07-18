import { Component, inject } from '@angular/core';
import { HeaderStartComponent } from "../shared/header-start/header-start.component";
import { Router, RouterLink } from '@angular/router';
import { FooterStartComponent } from "../shared/footer-start/footer-start.component";
import { User } from '../../models/user.class';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [
    HeaderStartComponent,
    RouterLink,
    FooterStartComponent,
    FormsModule,
    NgClass
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  isPolicyAccepted = false;
  isHovering = false;
  user = new User();
  emailTouched = false;
  nameTouched = false;
  passwordTouched = false;
  policyTouched = false;
  public userService = inject(UserService);
  private router = inject(Router);

  private isValidEmail(email: string): boolean {
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test(email);
  }

  private isValidPassword(password: string) {
    if (!password || password.length < 8) {
      return false;
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }

  get showEmailError(): boolean {
    return this.emailTouched && !!this.user.email && !this.isValidEmail(this.user.email);
  }

  get showNameError(): boolean {
    return this.nameTouched && !this.user.name;
  }

  get showPasswordError(): boolean {
    return this.passwordTouched && !!this.user.password && !this.isValidPassword(this.user.password);
  }

  get passwordErrorMessage(): string {
    if (!this.user.password) return '';
    
    if (this.user.password.length < 8) {
      return 'Das Passwort muss mindestens 8 Zeichen lang sein.';
    }
    
    const missing = [];
    if (!/[A-Z]/.test(this.user.password)) missing.push('Großbuchstabe');
    if (!/[a-z]/.test(this.user.password)) missing.push('Kleinbuchstabe');
    if (!/\d/.test(this.user.password)) missing.push('Zahl');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.user.password)) missing.push('Sonderzeichen');
    
    if (missing.length > 0) {
      return `Das Passwort benötigt: ${missing.join(', ')}`;
    }
    
    return '';
  }

  get showPolicyError(): boolean {
    return this.policyTouched && !this.isPolicyAccepted;
  }

  get isFormValid() {
    return (
      this.isPolicyAccepted &&
      !!this.user.name &&
      !!this.user.email &&
      this.isValidEmail(this.user.email) &&
      !!this.user.password &&
      this.isValidPassword(this.user.password)
    );
  }

  markEmailTouched() {
    this.emailTouched = true;
  }

  markNameTouched() {
    this.nameTouched = true;
  }

  markPasswordTouched() {
    this.passwordTouched = true;
  }

  togglePolicy() {
    this.isPolicyAccepted = !this.isPolicyAccepted;
    this.policyTouched = true;
  }
  
  getCheckboxImage(): string {
    if (this.isPolicyAccepted) {
      return this.isHovering ? 'signup/box-checked-hover.png' : 'signup/box-checked.png';
    } else {
      return this.isHovering ? 'signup/box-hover.png' : 'signup/box.png';
    }
  }

  navigateToAvatar() {
    this.userService.createInitialUser(this.user).then(() => {
      this.router.navigate(['/avatar']);
    }).catch(error => {
      console.error('Error during user creation:', error);
    });
  }
}
