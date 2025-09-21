import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DeviceService } from '../../../../core/services/device.service';
import { Device } from '../../../../core/models/device';
import { Brand } from '../../../../core/models/brand';
import { Category } from '../../../../core/models/category';

// importa los componentes…
import { DeviceCardComponent } from '../../components/device-card/device-card.component';
import { FiltersBarComponent } from '../../components/filters-bar/filters-bar.component';
// 👇 importa SOLO el tipo (no afecta al bundle)
import type { OrderBy } from '../../components/filters-bar/filters-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DeviceCardComponent, FiltersBarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  all: Device[] = [];
  filtered: Device[] = [];

  brands: Brand[] = [];
  categories: Category[] = [];

  q = '';
  brand = 'all';
  category = 'all';
  // 👇 tipa correctamente:
  order: OrderBy = 'release_desc';

  constructor(private deviceSrv: DeviceService, private http: HttpClient) {}

  ngOnInit(): void {
    this.deviceSrv.getAll().subscribe(devs => { this.all = devs; this.apply(); });
    this.http.get<Brand[]>('assets/mock/brands.json').subscribe(b => this.brands = b);
    this.http.get<Category[]>('assets/mock/categories.json').subscribe(c => this.categories = c);
  }

  onOrderChange(v: OrderBy) { this.order = v; this.apply(); }  // 👈 handler tipado

  apply() {
    let list = [...this.all];
    if (this.brand !== 'all') list = list.filter(d => d.brandId === this.brand);
    if (this.category !== 'all') list = list.filter(d => d.categoryId === this.category);
    if (this.q.trim()) {
      const q = this.q.toLowerCase();
      list = list.filter(d => (d.name + ' ' + (d.tags||[]).join(' ') + ' ' + (d.description||'')).toLowerCase().includes(q));
    }
    switch (this.order) {
      case 'price_asc':  list.sort((a,b)=>a.priceCOP-b.priceCOP); break;
      case 'price_desc': list.sort((a,b)=>b.priceCOP-a.priceCOP); break;
      default:           list.sort((a,b)=> a.releaseDate < b.releaseDate ? 1 : -1);
    }
    this.filtered = list;
  }
}
