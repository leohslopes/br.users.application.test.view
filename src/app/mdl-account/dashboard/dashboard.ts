import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../user-service';
import { UserAuthService } from '../../shared/user-auth-service';
import { AuthService } from '../../mdl-auth/auth-service';
import { AlertService } from '../../alert/alert-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { IReportUserAllAges, IReportUserGender, IReportUserPicture } from '../../models/users';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgChartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
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

  //Grafico de dispersão
  public scatterChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.raw.label}: ${context.raw.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Categoria'
        },
        ticks: {
          callback: function (value: any, index: number) {
            if (index === 0) return 'Com Foto';
            if (index === 1) return 'Sem Foto';
            return value;
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Qtd. Usuários'
        },
        beginAtZero: true
      }
    }
  };

  public scatterChartType: ChartType = 'scatter';
  public scatterChartData: any[] = [];
  public userCurrent?: any;

  public loginTime: Date = new Date();
  public sessionTime: string = '';
  public sessionModal?: bootstrap.Modal;
  public countdown: number = 300;
  public countdownDisplay: string = '';
  public countdownInterval: any;
  public firstCheckTimeout: any;
  public recurringInterval: any;

  constructor(private userService: UserService,
    private userAuthService: UserAuthService,
    private authService: AuthService,
    private alertService: AlertService) {

  }

  ngOnDestroy(): void {
    clearTimeout(this.firstCheckTimeout);
    clearInterval(this.recurringInterval);
    clearInterval(this.countdownInterval);
  }

  ngOnInit(): void {
    this.userAuthService.isLoggedIn().subscribe(__isLoged => this.isLoged = __isLoged);
    this.userCurrent = this.userAuthService.getUser();

    //Gráfico de total de usuário por mês
    this.getDashboard();

    //Gráfico da percentual por sexo
    this.getDashboardGender();

    //Gráfico da idade que mais se repete
    this.getDashboardAge();

    //Gráfico da imagens
    this.getDashboardPicture();

    this.firstCheckTimeout = setTimeout(() => {
      this.showModalSession();

      this.recurringInterval = setInterval(() => {
        this.showModalSession();
      }, 300000);
    }, 1800000);
  }

  Logout() {
    clearTimeout(this.firstCheckTimeout);
    clearInterval(this.recurringInterval);
    clearInterval(this.countdownInterval);
    this.sessionModal?.hide();
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
      const sorted = data.sort((a, b) => a.allAge - b.allAge);

      this.lineChartData.labels = sorted.map(item => item.allAge.toString());
      this.lineChartData.datasets[0].data = sorted.map(item => item.countAges);
    });
  }

  private getDashboardPicture() {
    this.userService.getDashboardPicture().subscribe((data: IReportUserPicture[]) => {
      this.scatterChartData = [{
        data: data.map((item, index) => ({
          x: index + 1,
          y: item.countPictures,
          label: item.resultPicture
        })),
        label: 'Usuários com/sem Foto',
        pointBackgroundColor: ['#007bff', '#dc3545'],
        pointRadius: 10,
        showLine: false
      }];
    });
  }

  private calculateTimeSession() {
    const currentDate = new Date();
    const diffMs = currentDate.getDate() - this.loginTime.getDate();
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    this.sessionTime = `${minutes} minutos e ${seconds} segundos`;
  }

  private showModalSession() {
    this.calculateTimeSession();
    this.resetCountdown();

    const modalElement = document.getElementById('sessionTimeModal');
    if (modalElement) {
      this.sessionModal = new bootstrap.Modal(modalElement);
      this.sessionModal.show();
    }
  }

  private resetCountdown() {
    this.countdown = 300;
    this.updateCountdownDisplay();

    // Limpa contadores anteriores
    clearInterval(this.countdownInterval);

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      this.updateCountdownDisplay();

      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.Logout(); // Auto logout se tempo esgotar
      }
    }, 1000);
  }

  private updateCountdownDisplay() {
    const min = Math.floor(this.countdown / 60);
    const sec = this.countdown % 60;
    this.countdownDisplay = `${this.pad(min)}:${this.pad(sec)}`;
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }

  continueSession() {
    this.loginTime = new Date();
    clearInterval(this.countdownInterval);
    this.sessionModal?.hide();
  }
}
