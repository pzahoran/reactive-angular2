import { provideRouter, RouterConfig }  from '@angular/router';
import { SearchRepo } from './search';
import { RepoDetail } from './repo';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
export default [
    provideRouter([
        { path: '', redirectTo: '/search', terminal: true }, 
        { path: 'search', component: SearchRepo },
        { path: 'repo/:owner/:repo', component: RepoDetail },
    ]),
    {provide: LocationStrategy, useClass: HashLocationStrategy},
];