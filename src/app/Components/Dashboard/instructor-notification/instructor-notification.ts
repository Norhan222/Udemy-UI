import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NotificatonService } from '../../../Services/notificaton-service';
import { CommonModule } from '@angular/common';
import { NotificationMessage } from '../../../Models/notification-message';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-instructor-notification',
  imports: [CommonModule],
  templateUrl: './instructor-notification.html',
  styleUrl: './instructor-notification.css',
})
export class InstructorNotification implements OnInit, OnDestroy {
  activeTab: 'instructor' | 'student' = 'instructor';
  showNotifications: boolean = false;
  notifications: any = { instructor: [], student: [] };
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    public notificationsService: NotificatonService,
    private ngZone: NgZone
  ) {
    // Subscribe to show/hide notifications
    this.notificationsService.showNotifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(show => {
        this.ngZone.run(() => {
          this.showNotifications = show;
        });
      });

    // Subscribe to notifications updates
    this.notificationsService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.ngZone.run(() => {
          this.notifications = notifications;
          console.log('Notifications updated:', notifications);
        });
      });
  }

  ngOnInit(): void {
    // Refresh notifications when component initializes
    this.notificationsService.refreshNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeNotifications() {
    this.notificationsService.hideNotifications();
  }

  switchTab(tab: 'instructor' | 'student') {
    this.activeTab = tab;
  }

  getActiveNotifications() {
    return this.notifications[this.activeTab] || [];
  }

  getUnreadCount() {
    return this.notificationsService.getUnreadCount();
  }
 areAllRead(): boolean {
    const activeNotifications = this.getActiveNotifications();
    if (activeNotifications.length === 0) return true;
    return activeNotifications.every((n: any) => n.isRead);
  }
  markAllAsRead() {
    this.notificationsService.markAllAsRead(this.activeTab);
  }

  markAsRead(notificationId: number) {
    this.notificationsService.markAsRead(notificationId, this.activeTab);
  }

  refreshNotifications() {
    this.isLoading = true;
    this.notificationsService.refreshNotifications();
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}