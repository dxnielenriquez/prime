import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  public counter = 0;

  constructor() {}

  increment() {
    this.counter++;
  }

  decrement() {
    this.counter--;
  }

}
