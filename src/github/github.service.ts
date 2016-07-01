import { OpaqueToken, Inject } from '@angular/core';
import octokat = require('octokat');
import { SearchResult, Repo, List, IssueQuery, IssueQueryParams, ListQuery } from 'octokat';

const PLUGINS = [
    require('octokat/dist/node/plugins/object-chainer'), 
    require('octokat/dist/node/plugins/promise/library-first'), 
    require('octokat/dist/node/plugins/path-validator'), 
    require('octokat/dist/node/plugins/authorization'), 
    require('octokat/dist/node/plugins/preview-apis'), 
    require('octokat/dist/node/plugins/use-post-instead-of-patch'), 
    require('octokat/dist/node/plugins/simple-verbs'), 
    require('octokat/dist/node/plugins/fetch-all'), 
    require('octokat/dist/node/plugins/read-binary'), 
    require('octokat/dist/node/plugins/pagination'), 
    // FIXME: disable octokat's buggy cache handler
    //require('octokat/dist/node/plugins/cache-handler'), 
    require('octokat/dist/node/plugins/hypermedia'), 
    require('octokat/dist/node/plugins/camel-case')
];

export const githubtoken = new OpaqueToken("githubtoken");

export class GitHubService {
    octo: octokat.Octokat;

    constructor(
        @Inject(githubtoken) token: string
    ) {
        this.octo = octokat({token, plugins: PLUGINS}); 
    }

    searchRepos(q: string): Promise<SearchResult<Repo>> {
        return GitHubService.handle('search repo', (q) => this.octo
            .search
            .repositories
            .fetch({q:q}),
            q
        );
    }

    async repo(owner: string, name: string): Promise<Repo> {
        return GitHubService.handle('load repo', (owner, name) => this.octo
            .repos(owner, name)
            .fetch(),
            owner, name
        );
    }

    async issues(owner: string, repoName: string, params?: IssueQueryParams): Promise<IssueQuery> {
        return GitHubService.handle('load issues', (owner, repoName, params) => this.octo
            .repos(owner, repoName)
            .issues
            .fetch(params),
            owner, repoName, params
        );
    }

    async more<ID, O, R>(list: ListQuery<ID, O, R>): Promise<ListQuery<ID, O, R>> {
        return GitHubService.handle('more', (list: ListQuery<ID,O,R>) => list
            .nextPage
            .fetch(),
            list
        );
    }

    private static async handle<T>(op: string, p: (...args:any[]) => Promise<T>, ...args:any[]): Promise<T> {
        console.log({fetching:op, args});
        try {
            const res = await p(...args);

            // KLUDGE: octokat fails to throw when there is no internet.
            if (res as any == "") throw res;

            console.log({fetched:op, res, args});
            return res;
        } catch(er) {
            const msg = GitHubService.message(er);
            console.log({'fetch failed':op, er, msg, args});
            throw msg;
        }
    }

    private static message(er:any): string {
        if (er.message) {
            try {
                const json = JSON.parse(er.message);
                if (json.message) {
                    if (json.message == "Validation Failed" && json.errors && json.errors.length > 0)
                        return json.errors[0].message;
                    else 
                        return json.message;
                } else 
                    return er.message;
            } catch(erT) {
                return er.message;
            }
        } 
        return "An error occured";
    }
}