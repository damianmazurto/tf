import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { GithubService } from '../github.service';
import { Subject, EMPTY, throwError, of } from 'rxjs';
import { switchMap, tap, catchError, shareReplay, delay } from 'rxjs/operators';

@Component({
  selector: 'app-github-list',
  templateUrl: './github-list.component.html',
  styleUrls: ['./github-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubListComponent implements OnInit, OnChanges {

  constructor(private _githubService: GithubService) { }

  @Input() username: string;
  @Output() onFinish = new EventEmitter<any>();

  private usernameChangedSubject = new Subject<string>();
  usernameChangedAction$ = this.usernameChangedSubject.asObservable().pipe(
    delay(1000),
    switchMap((username) => (
      this._githubService.getUserReposWithBranches(username).pipe(
        tap(() => this.onFinish.emit(true)),
        catchError((error) => {
          this.onFinish.emit({error});
          return of([]);
        }),
      )
    ))
  );

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if(changes.username) {
      this.usernameChangedSubject.next(changes.username.currentValue);
    }
  }
}
