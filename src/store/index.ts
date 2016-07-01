import { Subject, Observable, Observer } from 'rxjs';
import { OpaqueToken, Inject, provide } from '@angular/core';
import { initState, dispatcher, state } from './core';
import { Action } from './action';
import { Model } from './model';
import { Controller } from './controller';

export * from './core';
export * from './model';
export * from './action';

export function provideController() {
    const init: Model = {
        ver: 0,
        error: null,
        search: {
            term:'', 
            result: null,
        }, 
        repoDetail: {
            selectedRepo: null,
        }, 
        repoCache: {},
    };

    return [
        provide(initState, {useValue: init}),
        provide(dispatcher, {useValue: new Subject<Action>(null)}),
        Controller,
        provide(state, {
            useFactory: (controller: Controller, initState: Model, dispatcher: Observable<Action>) => controller.reduce(initState, dispatcher), 
            deps: [Controller, new Inject(initState), new Inject(dispatcher)]
        })
    ];
}
