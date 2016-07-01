import { Observable, Subscription } from 'rxjs';
import { Component, Input, Inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Repo, Issue, List } from '../github';
import { Model, state, Dispatcher, dispatcher, FetchMoreIssuesAction, SelectRepoAction } from '../store';
import { IssueList } from './issue-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'repo-detail',
  templateUrl: 'repo/repo-detail.component.html',
  directives: [IssueList]
})
export class RepoDetail implements OnDestroy {
  repo: Observable<Repo>;
  issues: Observable<List<Issue>>;
  fetching: Observable<boolean>;
  sub: Subscription

  constructor(
    @Inject(dispatcher) private dispatcher: Dispatcher,
    @Inject(state) private state: Observable<Model>,
    @Inject(ActivatedRoute) private route: ActivatedRoute
  ) {
    const repoDetail = state.map(state => state.repoCache[state.repoDetail.selectedRepo]);
    this.repo = repoDetail.map(state => state && state.repo);
    this.issues = repoDetail.map(state => state && state.issues);
    this.fetching = repoDetail.map(state => state && state.isFetching);

    this.sub = route.params.subscribe(params => {
      this.dispatcher.next(new SelectRepoAction(params['owner'], params['repo']))
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
