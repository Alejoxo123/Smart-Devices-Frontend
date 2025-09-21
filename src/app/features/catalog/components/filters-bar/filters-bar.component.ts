import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Brand } from '../../../../core/models/brand';
import { Category } from '../../../../core/models/category';

export type OrderBy = 'release_desc' | 'price_asc' | 'price_desc';

@Component({
  selector: 'app-filters-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters-bar.component.html',
  styleUrls: ['./filters-bar.component.scss'],
})
export class FiltersBarComponent {
  @Input() brands: Brand[] = [];
  @Input() categories: Category[] = [];

  @Input() q = '';
  @Input() brand = 'all';
  @Input() category = 'all';
  @Input() order: OrderBy = 'release_desc';

  @Output() qChange = new EventEmitter<string>();
  @Output() brandChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() orderChange = new EventEmitter<OrderBy>();
  @Output() changed = new EventEmitter<{ q: string; brand: string; category: string; order: OrderBy }>();

  private emitAll() {
    this.changed.emit({ q: this.q, brand: this.brand, category: this.category, order: this.order });
  }

  onQ(v: string) { this.q = v; this.qChange.emit(v); this.emitAll(); }
  onBrand(v: string) { this.brand = v; this.brandChange.emit(v); this.emitAll(); }
  onCategory(v: string) { this.category = v; this.categoryChange.emit(v); this.emitAll(); }
  onOrder(v: OrderBy) { this.order = v; this.orderChange.emit(v); this.emitAll(); }
}
