import { Component } from '@angular/core';
import { UserMenu } from '../../NavbarComponents/user-menu/user-menu';
import { NotificatonService } from '../../../Services/notificaton-service';
import { InstructorNotification } from '../instructor-notification/instructor-notification';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [UserMenu, InstructorNotification, TranslateModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  role = 'Student';
  private hideTimeout: any;

  constructor(public notificationsService: NotificatonService) {

  }
  navigateToHome() {
    window.location.href = '/';
  }

  onNotificationMouseEnter() {

    this.notificationsService.toggleNotifications();
  }
  onNotificationMouseLeave() {
    this.notificationsService.hideNotifications();
  }

  getUnreadCount(): number {
    return this.notificationsService.getUnreadCount();

  }
}
