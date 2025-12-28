import { Component } from '@angular/core';
import { NotificatonService } from '../../../Services/notificaton-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructor-notification',
  imports: [CommonModule],
  templateUrl: './instructor-notification.html',
  styleUrl: './instructor-notification.css',
})
export class InstructorNotification {
activeTab: 'instructor' | 'student' = 'instructor';
  showNotifications: boolean = false;


constructor(private notificationsService:NotificatonService){
   this.notificationsService.showNotifications$.subscribe(show => {
      this.showNotifications = show;
    });
}
closeNotifications() {
    this.notificationsService.hideNotifications();
  }

  switchTab(tab: 'instructor' | 'student') {
    this.activeTab = tab;
  }

  getActiveNotifications() {
    return this.notificationsService.notifications[this.activeTab];
  }

  getUnreadCount() {
    return this.notificationsService.getUnreadCount();
  }

  markAllAsRead() {
    this.notificationsService.notifications[this.activeTab].forEach(n => n.isRead = true);
  }

  markAsRead(notificationId: number) {
    const notification = this.notificationsService.notifications[this.activeTab].find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }



}


