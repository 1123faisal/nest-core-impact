import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.css'],
  standalone: true,
  imports: [NgIf],
})
export class InputErrorComponent {
  @Input() minMsg?: string;
  @Input() maxMsg?: string;
  @Input() minLengthMsg?: string;
  @Input() maxLengthMsg?: string;
  @Input() requredMsg?: string;
  @Input() invalidMsg?: string;
  @Input() emailMsg?: string;
  @Input() patternMsg?: string;

  @Input() control!: AbstractControl;
  @Input() fieldName!: string;
  @Input() max?: number;
  @Input() min?: number;
  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() showOnlyError?: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  getErrorMsg() {
    if (
      this.control.hasError('required') ||
      this.control.hasError('notEmpty')
    ) {
      return this.requredMsg
        ? this.requredMsg
        : this.fieldName + ' is required!';
    }

    if (this.control.hasError('email')) {
      return this.invalidMsg
        ? this.invalidMsg
        : this.fieldName + ' is invalid!';
    }

    if (this.control.hasError('invalid')) {
      return this.invalidMsg
        ? this.invalidMsg
        : this.fieldName + ' is invalid!';
    }

    if (this.control.hasError('pattern')) {
      return this.patternMsg
        ? this.patternMsg
        : this.fieldName + ' is invalid!';
    }

    if (this.control.hasError('min')) {
      return this.minMsg
        ? this.minMsg
        : this.fieldName +
            ' must be greater than or equal to ' +
            this.min +
            '!';
    }

    if (this.control.hasError('matDatepickerMin')) {
      return this.minMsg
        ? this.minMsg
        : this.fieldName + ' must be greater than or equal to start date!';
    }

    if (this.control.hasError('max')) {
      return this.maxMsg
        ? this.maxMsg
        : this.fieldName + ' must be less than or equal to ' + this.max + '!';
    }

    if (this.control.hasError('minlength')) {
      return this.minLengthMsg
        ? this.minLengthMsg
        : this.fieldName +
            ' length must be grator than ' +
            this.minLength +
            ' Charactors!';
    }

    if (this.control.hasError('maxlength')) {
      return this.maxLengthMsg
        ? this.maxLengthMsg
        : this.fieldName +
            ' length must be less than ' +
            this.maxLength +
            ' Charactors!';
    }

    if (this.control.hasError('uriError')) {
      return this.control.errors!['uriError']['msg'];
    }

    if (this.control.hasError('mobileError')) {
      return this.control.errors!['mobileError']['msg'];
    }

    if (
      this.control.hasError('addressErr') &&
      !(this.control.hasError('addressErr') as any)['valid']
    ) {
      return this.control.errors!['addressErr']['msg'];
    }

    return;
  }
}
