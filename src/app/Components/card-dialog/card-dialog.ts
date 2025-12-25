
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ICourse } from '../../Models/icourse';

@Component({
  selector: 'app-card-dialog',
  imports: [CommonModule, DialogModule],
  templateUrl: './card-dialog.html',
  styleUrl: './card-dialog.css',
})
export class CardDialog {
  @Input() data?: ICourse | undefined;
  @Input() visible = false;

}

/*
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-products-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  template: 
    <p-dialog
      [(visible)]="visible"
      [modal]="false"
      [dismissableMask]="false"
      [closable]="false"
      [style]="{ width: '350px' }"
    >
      <ng-template pTemplate="header">
        Products
      </ng-template>

      <ul>
        <li *ngFor="let product of data">
          {{ product.name }} - {{ product.price }}$
        </li>
      </ul>
    </p-dialog>
  
})
export class ProductsDialogComponent {
  @Input() data: any[] = [];
  @Input() visible = false;
}
*/ 