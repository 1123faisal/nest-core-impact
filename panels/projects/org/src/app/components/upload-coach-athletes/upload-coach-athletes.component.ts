import { Component, EventEmitter, Input } from '@angular/core';

enum FormMode {
  Athlete = 'Athlete',
  Coach = 'Coach',
}

@Component({
  selector: 'app-upload-coach-athletes',
  templateUrl: './upload-coach-athletes.component.html',
  styleUrls: ['./upload-coach-athletes.component.css'],
  standalone: true,
})
export class UploadCoachAthletesComponent {
  @Input() mode!: FormMode;
  onClose = new EventEmitter<void>();

  close() {
    this.onClose.next();
  }
}
