import { NgModule } from '@angular/core';
import { GithubListComponent } from './github-list/github-list.component';
import { GithubService } from './github.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    declarations: [
        GithubListComponent
    ],
    exports: [
        GithubListComponent
    ],
    providers: [
        GithubService
    ]
})
export class GithubModule {}