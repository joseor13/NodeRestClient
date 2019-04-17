import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { HttpService } from '../../shared-service/http.service';

export interface INursery {
  id?: number;
  plant: string;
  image: string;
  price: number;
  quantity: number;
  description: string;
}

@Component({
  selector: 'app-nursery',
  templateUrl: './nursery.component.html',
  styleUrls: ['./nursery.component.css']
})
export class NurseryComponent implements OnInit {

  bikes: Array<INursery> = [];
  myName = '';
  plants = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private http: HttpService
  ) { }

  async ngOnInit() {
    await this.refresh();
  }

  async refresh() {
    this.plants = await this.getPlants('nursery');
  }
  async getPlants(path: string) {
    const resp = await this.http.get(path);
    return resp;
  }
  async createPlant() {
    const nursery = {
      plant: null,
      color: null,
      price: null
    };
    const resp = await this.http.post('nursery', nursery);
    if (resp) {
      this.plants.unshift(resp);
    } else {
      this.toastService.showToast('danger', 3000, 'nursery create failed');
    }
    return resp;
  }

  async updatePlant(nursery: any) {
    const resp = await this.http.put(`nursery/id/${nursery.id}`, nursery);
    if (resp) {
      this.toastService.showToast('success', 3000, 'nursery updated successufully');
    }
    return resp;
  }

  async removePlant(nursery: any, index: number) {
    const resp = await this.http.delete(`nursery/id/${nursery.id}`);
    if (resp) {
      this.refresh();
    } else {
      this.toastService.showToast('danger', 3000, 'delete nursery failed');
    }
  }
}
