import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { GithubListComponent } from './github-list.component';
import { GithubService } from '../github.service';
import { SimpleChanges, SimpleChange, DebugElement } from '@angular/core';
import { of } from 'rxjs';

class GithubServiceStub {
  getUserReposWithBranches(username) {
    return  of([{ name: 'cc', login: 'damianmazurto'}])
  }
};

describe('GithubListComponent', () => {
  let component: GithubListComponent;
  let fixture: ComponentFixture<GithubListComponent>;
  let githubStub: GithubService;
  let el: DebugElement;
  let changesObj: SimpleChanges;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ 
        GithubListComponent 
      ],
      providers: [
        {
          provide: GithubService, useClass: GithubServiceStub
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    githubStub = TestBed.get(GithubService);
    el = fixture.debugElement;

    changesObj = {
      username: new SimpleChange('', 'damianmazurto', true)
    };
    component.username = 'damianmazurto';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call next when username changes', async(()=> {
    spyOn(component.usernameChangedSubject, 'next').and.callThrough();

    component.ngOnChanges(changesObj);
    fixture.detectChanges();

    expect(component.usernameChangedSubject.next).toHaveBeenCalledWith('damianmazurto');
  }));

  it('should call getUserReposWithBranches with username when usernameChangeAction subscribe', async(()=> {
    spyOn(githubStub, 'getUserReposWithBranches').and.callThrough();

    component.usernameChangedAction$.subscribe((res) => { 
      expect(githubStub.getUserReposWithBranches).toHaveBeenCalledWith('damianmazurto');
    })
    component.ngOnChanges(changesObj);
    fixture.detectChanges();
  }));

  it('should run onFinish emit method when getUserReposWithBranches succeed', async(()=> {
    spyOn(component.onFinish, 'emit').and.callThrough();

    component.usernameChangedAction$.subscribe((res) => { 
      expect(component.onFinish.emit).toHaveBeenCalledWith(true);
    })
    component.ngOnChanges(changesObj);
    fixture.detectChanges();
  }))

  it('should get proper data', async(()=> {
    component.usernameChangedAction$.subscribe((res) => { 
      expect(res).toEqual([{ name: 'cc', login: 'damianmazurto'}]);
    })
    component.ngOnChanges(changesObj);
    fixture.detectChanges();
  }));
});
