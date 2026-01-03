import { NotificationMessage } from './../Models/notification-message';
import { InstructorService } from './instructor-service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificatonService {
  private showNotificationsSubject = new BehaviorSubject<boolean>(false);
  showNotifications$ = this.showNotificationsSubject.asObservable();

  // Use BehaviorSubject to make notifications reactive
  private notificationsSubject = new BehaviorSubject<{
    instructor: NotificationMessage[];
    student: any[];
  }>({
    instructor: [],
    student: [
     
    ]
  });

  notifications$ = this.notificationsSubject.asObservable();

  get notifications() {
    return this.notificationsSubject.value;
  }

  constructor(private InstructorService: InstructorService) {
    this.loadInstructorNotifications();
  }

  // Load notifications from API
  loadInstructorNotifications() {
    this.InstructorService.getRejectedCourses().pipe(
      tap(res => {
        const formattedNotifications = this.formatNotifications(res);
        this.updateInstructorNotifications(formattedNotifications);
      })
    ).subscribe({
      next: () => {
        console.log('Notifications loaded successfully');
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  // Format notifications from API response
  private formatNotifications(data: any): NotificationMessage[] {
    // Handle both array and object with data property
    const notificationsArray = Array.isArray(data) ? data : (data?.data || []);

    if (!notificationsArray || notificationsArray.length === 0) {
      return [];
    }

    return notificationsArray.map((item:NotificationMessage, index:any) => ({
      id: item.id || index + 1,
      message: item.rejectionReason || item.messageTitle || 'New notification',
      messageTitle: item.messageTitle || item.rejectionReason || 'Notification',
      time:  item.time,
      isRead: item.isRead || false,

    }));
  }

  // Format time helper
  private formatTime(date: Date | string): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  }

  // Update instructor notifications
  private updateInstructorNotifications(notifications: NotificationMessage[]) {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next({
      ...current,
      instructor: notifications
    });
  }

  showNotifications() {
    this.showNotificationsSubject.next(true);
  }

  hideNotifications() {
    this.showNotificationsSubject.next(false);
  }

  toggleNotifications() {
    this.showNotificationsSubject.next(!this.showNotificationsSubject.value);
  }

  getUnreadCount(): number {
    const current = this.notificationsSubject.value;
    const instructorUnread = current.instructor.filter(n => !n.isRead).length;
    const studentUnread = current.student.filter(n => !n.isRead).length;
    return instructorUnread + studentUnread;
  }

  markAsRead(notificationId: number, type: 'instructor' | 'student') {
    const current = this.notificationsSubject.value;
    const notification = current[type].find(n => n.id === notificationId);

    if (notification) {
      notification.isRead = true;
      this.notificationsSubject.next({ ...current });
    }
  }

  markAllAsRead(type: 'instructor' | 'student') {
    const current = this.notificationsSubject.value;
    current[type].forEach(n => n.isRead = true);
    this.notificationsSubject.next({ ...current });
  }

  refreshNotifications() {
    this.loadInstructorNotifications();
  }
}
