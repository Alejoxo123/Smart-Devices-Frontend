import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Device } from '../../../../core/models/device';
import { Brand } from '../../../../core/models/brand';
import { Category } from '../../../../core/models/category';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  brands: Brand[] = [];
  categories: Category[] = [];

  // Modelo del formulario (template-driven)
  form = {
    name: '',
    brandId: '',
    categoryId: '',
    releaseDate: '', // yyyy-mm-dd
    priceCOP: 0,

    // specs sueltas para armar el objeto
    cpu: '',
    ram: '',
    storage: '',
    display: '',
    battery: '',
    os: '',

    description: '',
    tagsInput: '',    // "5G, Android"
    imagesInput: ''   // "assets/images/foto1.jpg, assets/images/foto2.jpg"
  };

  copied = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Carga de catálogos desde mocks
    this.http.get<Brand[]>('assets/mock/brands.json').subscribe(b => (this.brands = b));
    this.http.get<Category[]>('assets/mock/categories.json').subscribe(c => (this.categories = c));
  }

  private slugify(s: string): string {
    return s
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private idPrefixByCategory(catId: string): string {
    switch (catId) {
      case 'phone': return 'ph';
      case 'laptop': return 'lp';
      case 'tablet': return 'tb';
      default: return 'dv';
    }
  }

  private generateId(): string {
    const prefix = this.idPrefixByCategory(this.form.categoryId || '');
    // ID legible + sufijo único corto
    const slug = this.slugify(this.form.name || 'dispositivo');
    const uniq = Date.now().toString(36).slice(-5);
    return `${prefix}-${slug}-${uniq}`;
  }

  get devicePreview(): Device {
    const tags = this.form.tagsInput
      ? this.form.tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const images = this.form.imagesInput
      ? this.form.imagesInput.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const specs: Record<string, string> = {};
    if (this.form.cpu) specs['cpu'] = this.form.cpu;
    if (this.form.ram) specs['ram'] = this.form.ram;
    if (this.form.storage) specs['storage'] = this.form.storage;
    if (this.form.display) specs['display'] = this.form.display;
    if (this.form.battery) specs['battery'] = this.form.battery;
    if (this.form.os) specs['os'] = this.form.os;

    const device: Device = {
      id: this.generateId(),
      name: this.form.name.trim(),
      brandId: this.form.brandId,
      categoryId: this.form.categoryId,
      releaseDate: this.form.releaseDate, // "YYYY-MM-DD"
      priceCOP: Number(this.form.priceCOP) || 0,
      specs,
      images,
      tags,
      description: this.form.description?.trim() || '',
      ratingAvg: undefined
    };

    return device;
  }

  get previewJson(): string {
    return JSON.stringify(this.devicePreview, null, 2);
  }

  copyToClipboard(): void {
    this.copied = false;
    const text = this.previewJson;
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 2000);
      });
    } else {
      // Fallback muy básico si no hay clipboard API
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); this.copied = true; } finally {
        document.body.removeChild(ta);
        setTimeout(() => (this.copied = false), 2000);
      }
    }
  }

  downloadJson(): void {
    const blob = new Blob([this.previewJson], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    // Nombre sugerido basado en el id generado
    a.download = `${this.devicePreview.id}.json`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }

  resetForm(): void {
    this.form = {
      name: '',
      brandId: '',
      categoryId: '',
      releaseDate: '',
      priceCOP: 0,
      cpu: '',
      ram: '',
      storage: '',
      display: '',
      battery: '',
      os: '',
      description: '',
      tagsInput: '',
      imagesInput: ''
    };
  }
}
