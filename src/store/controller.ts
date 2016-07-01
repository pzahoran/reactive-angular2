import * as _ from '../utils';
import { Observable, BehaviorSubject } from 'rxjs';
import { Inject } from '@angular/core';
import { GitHubService, Repo, SearchResult, IssueQuery } from '../github';
import { dispatcher, Dispatcher } from './core';
import * as Action from './action';
import * as Model from './model'; 

export class Controller {
    constructor(
        @Inject(dispatcher) private dispatcher: Dispatcher,
        @Inject(GitHubService) private githubservice: GitHubService
    ) {}

    error(init: string, actions: Observable<Action.Action>): Observable<string> {
        return actions.scan((state, action) => {
            if (Action.isError(action)) {
                return action.er;
            } 
            if (action instanceof Action.DismissError) {
                return undefined;
            }
            return state;
        }, init);
    }

    search(init: Model.SearchModel, actions: Observable<Action.Action>): Observable<Model.SearchModel> {
        return actions.scan((state, action) => {
            if (action instanceof Action.SearchAction) {
                if (state.term != action.term /* KLUDGE */) {
                    this.githubservice
                        .searchRepos(action.term)
                        .then(res => this.dispatcher.next(new Action.SearchResultAction(res)))
                        .catch(er => this.dispatcher.next(new Action.ErrorFetchingSearchResultAction(er)));
                }
                return _.merge(state, {term: action.term});
            }

            if (action instanceof Action.SearchResultAction) {
                return _.merge(state, {result: _.replace(action.result)});
            }

            if (action instanceof Action.ErrorFetchingSearchResultAction) {
                return _.merge(state, {result: _.remove()});
            }

            return state;
        }, init);
    }

    repoDetail(init: Model.RepoDetailModel, actions: Observable<Action.Action>): Observable<Model.RepoDetailModel> {
        return actions.scan((state, action) => {
            if (action instanceof Action.SelectRepoAction) {
                return _.merge(state, {
                    selectedRepo: action.owner + '/' + action.repo,
                });
            }

            return state;
        }, init);
    }

    repoCache(init: Model.RepoCacheModel, actions: Observable<Action.Action>): Observable<Model.RepoCacheModel> {
        return actions.scan((state, action) => {
            if (action instanceof Action.SelectRepoAction) {
                const repoName = action.owner + '/' + action.repo;

                if (state[repoName]) {
                    return state;
                }

                Promise.all([
                    this.githubservice.repo(action.owner, action.repo),
                    this.githubservice.issues(action.owner, action.repo, {})
                ])
                .then(([repo, issues]) => this.dispatcher.next(new Action.RepoFetchedAction(repoName, repo, issues)))
                .catch(er => this.dispatcher.next(new Action.ErrorFetchingRepoAction(repoName, er)));

                return _.merge(state, {
                    [repoName]: { isFetching: true, repo: _.remove(), issues: _.remove() }
                });
            }

            if (action instanceof Action.RepoFetchedAction) {
                return _.merge(state, {
                    [action.repoName]: { 
                        isFetching: false,
                        repo: _.replace(action.repo),
                        issues: _.replace(action.issues), 
                    }
                });
            }

            if (action instanceof Action.FetchMoreIssuesAction) {
                const { repoName } = action;
                const { issues } = state[repoName];

                this.githubservice.more(issues)
                    .then(moreIssues => {
                        moreIssues.items.unshift(...issues.items);
                        this.dispatcher.next(new Action.MoreIssuesFetchedAction(repoName, moreIssues));
                    })
                    .catch(er => {
                        this.dispatcher.next(new Action.ErrorFetchingMoreIssuesAction(repoName, er));
                    });

                return _.merge(state, {
                    [repoName]: {
                        isFetching: true,
                    }
                });
            }

            if (action instanceof Action.MoreIssuesFetchedAction) {
                return _.merge(state, {
                    [action.repoName]: {
                        isFetching: false,
                        issues: _.replace(action.issues),
                    }
                })
            }

            if (action instanceof Action.ErrorFetchingRepoAction || action instanceof Action.ErrorFetchingMoreIssuesAction) {
                return _.merge(state, {
                    [action.repoName]: _.remove()
                });
            }

            return state;
        }, init);
    }

    reduce(init: Model.Model, actions: Observable<Action.Action>): Observable<Model.Model> {
        const res = new BehaviorSubject(init);
        Observable
            .zip(
                actions.do(action => console.log({action})),
                actions.scan((ver, actions) => ver+1, init.ver),

                this.error(init.error, actions),
                this.search(init.search, actions),
                this.repoDetail(init.repoDetail, actions),
                this.repoCache(init.repoCache, actions),

                (_, ver, error, search, repoDetail, repoCache) => ({ver, error, search, repoDetail, repoCache})
            )
            .do(model => console.log({model, ver: model.ver}))
            .subscribe(state => res.next(state));
        return res;
    }
}

