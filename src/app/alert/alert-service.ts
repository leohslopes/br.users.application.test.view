import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
 private _alerts = new BehaviorSubject<AlertMessage[]>([]);
  private counter = 0;

  get alerts$(): Observable<AlertMessage[]> {
    return this._alerts.asObservable();
  }

  show(msg: string, type: AlertMessage['type'] = 'info', durationMs = 5000) {
    const id = ++this.counter;
    const alert: AlertMessage = { id, msg, type };
    this._alerts.next([...this._alerts.value, alert]);
    setTimeout(() => this.remove(id), durationMs);
  }

  success(msg: string, durationMs?: number) { this.show(msg, 'success', durationMs); }
  error(msg: string, durationMs?: number)   { this.show(msg, 'error',   durationMs); }
  info(msg: string, durationMs?: number)    { this.show(msg, 'info',    durationMs); }
  warning(msg: string, durationMs?: number) { this.show(msg, 'warning', durationMs); }

  remove(id: number) {
    this._alerts.next(this._alerts.value.filter(a => a.id !== id));
  }

  clear() {
    this._alerts.next([]);
  }
}

export interface AlertMessage {
  msg: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}