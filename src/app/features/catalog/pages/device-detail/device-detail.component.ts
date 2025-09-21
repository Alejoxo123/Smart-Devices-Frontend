import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from '../../../../core/services/device.service';
import { Device } from '../../../../core/models/device';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss'],
})
export class DeviceDetailComponent implements OnInit {
  device?: Device;

  constructor(private route: ActivatedRoute, private deviceSrv: DeviceService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.deviceSrv.getById(id).subscribe(d => this.device = d);
  }
}
