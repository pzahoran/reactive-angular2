import { Observable } from 'rxjs';
import { Component, Inject, Input, ChangeDetectionStrategy } from '@angular/core';
import { SearchResult, Repo } from '../github';
import { RepoCard } from './repo-card.component';
import { SearchBar } from './search-bar.component';
import { state, Model } from '../store';

@Component({
  selector: 'search-repo',
  templateUrl: 'search/search-repo.component.html',
  directives: [
    RepoCard, 
    SearchBar,
  ]
})
export class SearchRepo {
  term: Observable<string>;
  searchResult: Observable<SearchResult<Repo>>;

  constructor(
      @Inject(state) private state: Observable<Model>
  ) {
    this.term = state.map(state => state.search.term);
    this.searchResult = state.map(state => state.search.result);
  } 

  repoKey(index: number, repo: Repo) {
    return repo.id;
  }
}
