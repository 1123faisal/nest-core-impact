import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-heat-map-metrics',
  templateUrl: './heat-map-metrics.component.html',
  styleUrls: ['./heat-map-metrics.component.css'],
  standalone: true,
})
export class HeatMapMetricsComponent implements OnInit {
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
