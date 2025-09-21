import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Device } from '../../../../core/models/device';

@Component({
  selector: 'app-device-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './device-card.component.html',
  styleUrls: ['./device-card.component.scss'],
})
export class DeviceCardComponent {
  @Input({ required: true }) device!: Device;
}
