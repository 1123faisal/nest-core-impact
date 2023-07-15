import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UiService } from '../../services/ui.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-resend-otp',
  templateUrl: './resend-otp.component.html',
  styleUrls: ['./resend-otp.component.css'],
  standalone: true,
  imports: [NgIf],
})
export class ResendOtpComponent implements OnInit, OnDestroy {
  otpExpirationTime: number = 60; // OTP expiration time in seconds
  timeLeft: string = '1:00'; // Initial time in the format mm:ss
  timer: any; // Timer variable
  @Input() email!: string;

  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer() {
    this.otpExpirationTime = 60;
    this.timeLeft = '1:00';
    this.timer = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  updateTimer() {
    this.otpExpirationTime--;
    const minutes = Math.floor(this.otpExpirationTime / 60);
    const seconds = this.otpExpirationTime % 60;

    this.timeLeft = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (this.otpExpirationTime === 0) {
      this.stopTimer();
    }
  }

  stopTimer() {
    clearInterval(this.timer);
    // Display the resend button or perform any other desired action
  }

  resendOtp() {
    this.snackBar.dismiss();
    this.authService.resentOtp(this.email).subscribe({
      next: () => {
        this.startTimer();
        this.uiService.openSnackbar(
          'OTP sent successfully to your registered Email Id.'
        );
      },
      error: () => {
        this.snackBar.open('error on sent otp.', undefined, { duration: 2000 });
      },
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
