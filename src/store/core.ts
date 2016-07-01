import { Subject, Observable, Observer } from 'rxjs';
import { OpaqueToken } from '@angular/core';
import { Action } from './action';
import { Model } from './model';

export const initState = new OpaqueToken("initState");
export const dispatcher = new OpaqueToken("dispatcher");
export const state = new OpaqueToken("state");

export type Dispatcher = Observer<Action>;
export type State = Observable<Model>;
