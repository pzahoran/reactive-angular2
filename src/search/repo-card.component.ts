import { Observable } from 'rxjs';
import { Component, Input, Inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Repo } from '../github';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'repo-card',
  templateUrl: '/search/repo-card.component.html',
})
export class RepoCard {
  @Input() repo: Repo;

  constructor(
    @Inject(Router) private router: Router
  ) {}

  select() {
    this.router.navigate(['/repo', this.repo.owner.login, this.repo.name]);
  }
}
