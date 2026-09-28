import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-powerbi-report',
  standalone: false,
  template: `
    <div style="width: 80%; margin: 40px auto; background: white; padding: 20px; border-radius: 8px;">
      <h2>⛽ Monthly Pump Transactions</h2>
      <p>Data fetched from Node.js + PostgreSQL (Docker)</p>
      <canvas #myChart></canvas>
    </div>
  `
})
export class PowerbiReport implements OnInit {
  @ViewChild('myChart') myChart!: ElementRef;

  async ngOnInit() {
    try {
      const response = await fetch('http://localhost:3000/api/monthly-data');
      const data = await response.json();

      const labels = data.map((row: any) => row.month);
      const counts = data.map((row: any) => row.transaction_count);

      new Chart(this.myChart.nativeElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Transactions per Month',
            data: counts,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } }
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
