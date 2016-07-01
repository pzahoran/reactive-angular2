import { bootstrap } from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { provide } from '@angular/core';
import { App } from './app';
import { GitHubService, githubtoken } from './github';
import { provideController } from './store';
import routes from './routes';

bootstrap(App, [
    disableDeprecatedForms(),
    provideForms(),
    GitHubService,
    provideController(),
    routes,
    provide(githubtoken, { useValue: require('./config.json').githubtoken}),
])
.catch(err => console.error(err));