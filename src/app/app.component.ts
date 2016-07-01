import { Observable } from 'rxjs';
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Debug } from '../utils';
import { Model, state } from '../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app',
  templateUrl: 'app/app.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    Debug,
  ]
})
export class App {
  constructor(
    @Inject(state) private state: Observable<Model>
  ) {}
}
