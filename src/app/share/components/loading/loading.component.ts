import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [LoadingService],
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {

  constructor(public loadingService : LoadingService) {
  }
}
