import { Component, Output, Input, Inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { FormControl, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { SearchAction, Dispatcher, dispatcher } from '../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'search-bar',
  templateUrl: '/search/search-bar.component.html',
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class SearchBar implements OnDestroy {
  private termControl: FormControl = new FormControl('');
  private searchClick$ = new Subject<void>();
  private sub:Subscription;

  @Input() term: string;

  constructor(
      @Inject(dispatcher) private dispatcher: Dispatcher
  ) {
    const term$ = (this.termControl.valueChanges as Observable<string>).skip(1);

    this.sub = Observable.combineLatest(
        term$.debounceTime(1000),
        this.searchClick$.startWith(null)
      )
      .withLatestFrom(term$, (_, term) => term)
      .filter(term => term.length > 0)
      .distinctUntilChanged()
      .subscribe(term => {
        this.dispatcher.next(new SearchAction(term))
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  searchClick() {
    this.searchClick$.next(null);
  }
}
