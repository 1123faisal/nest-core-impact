import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.css'],
})
export class TrainingsComponent implements OnInit {
  ngOnInit(): void {
    $(function () {
      $('input[name="daterange"]').daterangepicker(
        {
          opens: 'left',
        },
        function (start: any, end: any, label: any) {}
      );
    });
  }
}