import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AlertService, AlertMessage } from './alert-service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent implements OnInit {

  toasts: AlertMessage[] = [];
  constructor(private alertService: AlertService){
   
  }

  ngOnInit(): void {
    this.alertService.alerts$.subscribe(list => {
      this.toasts = list});
  }

  dismiss(id: number) {
    this.alertService.remove(id);
  }

}
