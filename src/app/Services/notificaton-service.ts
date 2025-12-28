import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class NotificatonService {
   showNotificationsSubject = new BehaviorSubject<boolean>(false);
  showNotifications$ = this.showNotificationsSubject.asObservable();

  toggleNotifications() {
    this.showNotificationsSubject.next(!this.showNotificationsSubject.value);
  }

  hideNotifications() {
    this.showNotificationsSubject.next(false);
  }

 notifications = {
    instructor: [
      {
        id: 1,
        icon: '🎓',
        message: 'The lecture that you requested to be deleted is now deleted.',
        time: '3 days ago',
        isRead: false
      },
      
    ],
    student: [
      {
        id: 4,
        icon: '📚',
        message: 'New lecture added to your enrolled course.',
        time: '2 days ago',
        isRead: false
      },
      {
        id: 5,
        icon: '🎯',
        message: 'You completed 50% of "Web Development Bootcamp".',
        time: '4 days ago',
        isRead: true
      }
    ]
  };

  getUnreadCount(): number {
    const instructorUnread = this.notifications.instructor.filter(n => !n.isRead).length;
    const studentUnread = this.notifications.student.filter(n=>!n.isRead).length;
    return instructorUnread + studentUnread;
  }
}
