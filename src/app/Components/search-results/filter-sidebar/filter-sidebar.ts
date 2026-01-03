import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchFacetsDto } from '../../../Models/search.models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-sidebar',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.css',
})
export class FilterSidebar implements OnInit {
  @Input() facets: SearchFacetsDto | null = null;
  @Input() isVisible: boolean = false;
  @Output() filterChange = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  selectedRating: number | null = null;
  selectedLanguages: string[] = [];
  selectedLevels: string[] = [];
  selectedPrice: string | null = null;

  ngOnInit(): void { }

  onRatingChange(rating: number): void {
    this.selectedRating = rating;
    this.emitFilters();
  }

  onLanguageChange(language: string, checked: boolean): void {
    if (checked) {
      this.selectedLanguages.push(language);
    } else {
      this.selectedLanguages = this.selectedLanguages.filter(l => l !== language);
    }
    this.emitFilters();
  }

  onLevelChange(level: string, checked: boolean): void {
    if (checked) {
      this.selectedLevels.push(level);
    } else {
      this.selectedLevels = this.selectedLevels.filter(l => l !== level);
    }
    this.emitFilters();
  }

  onPriceChange(price: string): void {
    this.selectedPrice = price;
    this.emitFilters();
  }

  emitFilters(): void {
    const filters: any = {};

    if (this.selectedRating !== null) {
      filters.minRating = this.selectedRating;
    }

    if (this.selectedLanguages.length > 0) {
      filters.language = this.selectedLanguages[0]; // Backend accepts single language
    }

    if (this.selectedLevels.length > 0) {
      filters.level = this.selectedLevels[0]; // Backend accepts single level
    }

    if (this.selectedPrice === 'Free') {
      filters.isFree = true;
    } else if (this.selectedPrice === 'Paid') {
      filters.isFree = false;
    }

    this.filterChange.emit(filters);
  }

  clearFilters(): void {
    this.selectedRating = null;
    this.selectedLanguages = [];
    this.selectedLevels = [];
    this.selectedPrice = null;

    // Emit empty filters to clear URL params
    this.filterChange.emit({
      minRating: null,
      language: null,
      level: null,
      isFree: null
    });

    this.closeSidebar();
  }

  closeSidebar(): void {
    this.close.emit();
  }

  getRatingValue(ratingName: string): number {
    // Parse "4.5 & up" -> 4.5
    const match = ratingName.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  get languages() {
    return this.facets?.languages || [];
  }

  get levels() {
    return this.facets?.levels || [];
  }

  get prices() {
    return this.facets?.price || [];
  }

  get ratings() {
    return this.facets?.ratings || [];
  }
  getTranslationKey(prefix: string, value: string): string {
    // Normalize value: "English (US)" -> "ENGLISH_US", "4.5 & up" -> "4_5_UP" (handled differently usually but for options)
    if (!value) return '';
    const normalized = value.toUpperCase()
      .replace(/\s+/g, '_')   // Replace spaces with underscores
      .replace(/[()]/g, '')   // Remove parentheses
      .replace(/&/g, 'AND');  // Replace & with AND

    return `${prefix}.${normalized}`;
  }
}
