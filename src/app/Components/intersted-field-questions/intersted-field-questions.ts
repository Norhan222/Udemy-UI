import { Component, OnInit } from '@angular/core';
import { RadioButton } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-intersted-field-questions',
  imports: [FormsModule, RadioButton],
  templateUrl: './intersted-field-questions.html',
  styleUrl: './intersted-field-questions.css',
})
export class InterstedFieldQuestions implements OnInit{
    selectedCategory: any = null;

    categories: any[] = [
        { name: 'Accounting', key: 'A' },
        { name: 'Marketing', key: 'M' },
        { name: 'Production', key: 'P' },
        { name: 'Research', key: 'R' }
    ];

    ngOnInit() {
        this.selectedCategory = this.categories[1];
    }
}
