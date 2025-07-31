import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user-service';
import { UserAuthService } from '../../shared/user-auth-service';
import { AuthService } from '../../mdl-auth/auth-service';
import { AlertService } from '../../alert/alert-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { IReportUserAllAges, IReportUserGender } from '../../models/users';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgChartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  public isLoged: boolean = false;
  //Gráfico de barras
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  //Gráfico da pizza
  public pieChartType: ChartType = 'pie';
  public pieChartLabels: string[] = [];
  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };
  public sum = 0;
  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw;
            const percent = ((value / this.sum) * 100).toFixed(1);
            return `${tooltipItem.label}: ${value} (${percent}%)`;
          }
        }
      }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Usuários por Mês',
        data: [],
        backgroundColor: '#1976d2'
      }
    ]
  };
  public pieChartColors = [
    {
      backgroundColor: ['#0d6efd', '#d63384'],
    }
  ];

  //Grafico de linhas
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Quantidade de Usuários',
        data: [],
        fill: true,
        tension: 0.3,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Idades que Mais se Repetem'
      }
    },
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  constructor(private userService: UserService,
    private userAuthService: UserAuthService,
    private authService: AuthService,
    private alertService: AlertService) {

  }

  ngOnInit(): void {
    this.userAuthService.isLoggedIn().subscribe(__isLoged => this.isLoged = __isLoged);

    //Gráfico de total de usuário por mês
    this.getDashboard();

    //Gráfico da percentual por sexo
    this.getDashboardGender();

    //Gráfico da idade que mais se repete
    this.getDashboardAge();
  }

  Logout() {
    this.userAuthService.clearToken();
  }

  private getDashboard() {
    this.userService.getDashboard().subscribe({
      next: response => {
        console.log(response);
        this.barChartData.labels = response.map(item => item.monthName);
        this.barChartData.datasets[0].data = response.map(item => item.countUsers);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  private getDashboardGender() {
    this.userService.getDashboardGender().subscribe((data: IReportUserGender[]) => {
      this.sum = data.reduce((sum, item) => sum + item.countGender, 0);

      this.pieChartData = {
        labels: data.map(item => item.genderName),
        datasets: [
          {
            data: data.map(item => item.countGender),
            backgroundColor: ['#0d6efd', '#d63384'],
            hoverBackgroundColor: ['#0b5ed7', '#c82370']
          }
        ]
      };
    });
  }

  private getDashboardAge() {
    this.userService.getDashboardAge().subscribe((data: IReportUserAllAges[]) => {
      debugger;
      const sorted = data.sort((a, b) => a.allAge - b.allAge);

      this.lineChartData.labels = sorted.map(item => item.allAge.toString());
      this.lineChartData.datasets[0].data = sorted.map(item => item.countAges);
    });
  }
}
