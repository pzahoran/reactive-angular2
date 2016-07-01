import { Component, Input, Inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Repo, Issue, List } from '../github';
import { Dispatcher, dispatcher, FetchMoreIssuesAction } from '../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'issue-list',
  templateUrl: '/repo/issue-list.component.html'
})
export class IssueList  {
  @Input() repoName: string;
  @Input() issues: List<Issue>;

  constructor(
    @Inject(dispatcher) private dispatcher: Dispatcher
  ) {}

  more() {
    this.dispatcher.next(new FetchMoreIssuesAction(this.repoName));
  }
}
