import { StringMap } from '@angular/compiler/src/compiler_facade_interface';

export interface gitRepo {
    name: string,
    login: string,
    branches?:gitBranch[],
}

export interface gitBranch {
    name: string,
    commit: {
        sha: string,
        url: string
    }
}

export type gitBranchReponse = gitBranch;

export interface gitReposResponse {
    name: string,
    owner: {
        login: string
    },
    fork: boolean
}

// export interface gitBranchesReponse