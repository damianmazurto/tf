import { Component } from '@angular/core';
import { filter, mapTo, tap, startWith, distinctUntilChanged } from 'rxjs/operators';
import { Subject, merge, } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private searchUserSubject = new Subject();
  searchUserAction$ = this.searchUserSubject.asObservable().pipe(
    filter(username => Boolean(username)),
    distinctUntilChanged(),
  );

  private searchFinishSubject = new Subject();
  searchFinishAction$ = this.searchFinishSubject.asObservable().pipe(
    tap(({error}) => {
      if(error)
        this.githubFormGroup.get('username').setErrors({serverError: error});
    })
  );

  githubFormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
  });

  search() {
    if(this.githubFormGroup.valid){
      const { username } = this.githubFormGroup.value;
      this.searchUserSubject.next(username);
    }
  }

  handleFinish(event) {
    this.searchFinishSubject.next(event);
  }

  loading$ = merge(
    this.searchUserAction$.pipe(mapTo(true)),
    this.searchFinishAction$.pipe(mapTo(false))
  ).pipe(startWith(false));
  
}

