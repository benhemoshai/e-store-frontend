import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from './admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeUsers: number | null = null; // Active Users Metric
  totalSales: number | null = null; // Total Sales Metric
  averageRating : number | null = null;
  topSellingProductsData: any[] = []; // Data for the Top 5 Selling Products chart
  orderStatusData: any[] = [];
  loading = true;
  color = 'vivid';

  constructor(private AdminDashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.fetchMetrics();
    this.fetchTopProducts();
    this.fetchOrderStatus();
  }

  fetchMetrics(): void {
    this.AdminDashboardService.getMetrics().subscribe({
      next: (data) => {
        this.activeUsers = data.activeUsers;
        this.totalSales = data.totalSales;
        this.averageRating = data.averageRating;
        this.loading = false; // Data loaded
      },
      error: () => {
        this.loading = false; // Stop loading on error
      }
    });
  }

  fetchTopProducts(): void {
    this.AdminDashboardService.getTopProducts().subscribe({
      next: (data) => {
        this.topSellingProductsData = data; // Set the data for the chart
      },
      error: (err) => {
        console.error('Error fetching top products:', err);
      }
    });
  }

  fetchOrderStatus(): void {
    this.AdminDashboardService.getOrderStatus().subscribe({
      next: (data) => {
        this.orderStatusData = data; // Set the data for the chart
      },
      error: (err) => {
        console.error('Error fetching top products:', err);
      }
    });
  }
}
