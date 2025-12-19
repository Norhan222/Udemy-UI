import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user-menu',
  standalone: true, // ✅ لازم
  imports: [CommonModule],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenu {

  isOpen = false;

  openMenu() {
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

  logout() {
    // authService.logout();
    this.closeMenu();
  }

  // يقفل لما أضغط في أي مكان بره
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrapper')) {
      this.isOpen = false;
    }
  }
}
