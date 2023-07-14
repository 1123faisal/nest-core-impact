import { Component, Input } from '@angular/core';
import { Athlete } from '../../../models/athlete.model';

@Component({
  selector: '[app-athelete-item]',
  templateUrl: './athelete-item.component.html',
  styleUrls: ['./athelete-item.component.css'],
})
export class AtheleteItemComponent {
  @Input() item!: Athlete;
  @Input() idx!: number;

  constructor() {}
}
