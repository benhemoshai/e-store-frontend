import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  private apiUrl = 'http://localhost:3000/admin/dashboard/metrics'; // Backend API URL
  private topProductsUrl = 'http://localhost:3000/admin/dashboard/top-products';
  private orderStatusUrl = 'http://localhost:3000/admin/dashboard/order-status';

  constructor(private http: HttpClient) {}

  // Fetch metrics from the backend
  getMetrics(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getTopProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.topProductsUrl);
  }

  getOrderStatus(): Observable<any[]>{
    return this.http.get<any[]>(this.orderStatusUrl);
  }
}