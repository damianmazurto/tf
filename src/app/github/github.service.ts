import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { switchMap, filter, map, toArray, flatMap, tap, catchError } from 'rxjs/operators';
import { forkJoin, of, throwError, Observable } from 'rxjs';

import { gitRepo, gitReposResponse, gitBranchReponse} from './github';

@Injectable()
export class GithubService {
    constructor(private _http: HttpClient) {}

    private _api = 'https://api.github.com';

    githubUserReposRequest = (username: string): Observable<gitReposResponse[]> => (
        this._http.get<gitReposResponse[]>(`${this._api}/users/${username}/repos`).pipe(
            tap(repos => console.log('Fetched User Repos', JSON.stringify(repos))),
            catchError(this.handleError)
        )
    );

    githubRepoBranchesRequest = (username: string, repo: string): Observable<gitBranchReponse[]> => (
        this._http.get<gitBranchReponse[]>(`${this._api}/repos/${username}/${repo}/branches`).pipe(
            tap(branches => console.log('Fetched User Repo Branches', JSON.stringify(branches))),
            catchError(this.handleError)
        )
    );

    getUserRepos = (username: string): Observable<gitRepo[]> => this.githubUserReposRequest(username).pipe(
        switchMap(repos => repos),
        filter(repo => !repo.fork),
        map(repo => ({
            name: repo.name, 
            login: repo.owner.login,
        }) as gitRepo),
        toArray(),
    );
    
    getUserReposWithBranches = (username: string): Observable<gitRepo[]> => this.getUserRepos(username).pipe(
        switchMap(repos => repos),
        flatMap(repo => (
          forkJoin(
            of(repo),
            this.githubRepoBranchesRequest(username, repo.name),
          ).pipe(
              map(([repo, branches]) => ({...repo, branches}) as gitRepo) 
            )
        )),
        toArray(),
    );

    getUserRepoBranches = (username, repo) => this.githubRepoBranchesRequest(username, repo);

    private handleError(err: HttpErrorResponse) {
        let errorMessage: string;
        
        //errorMessage = `An error occurred: ${err.error.message}`;
        if(err.status === 404)
            errorMessage = "User not found";
        else if(err.status === 403)
            errorMessage = "To much API calls, wait 1 hour";
        else {
            errorMessage = "Magic error";
        }
        return throwError(errorMessage);
    }
}