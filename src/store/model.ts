import { GitHubService, Repo, SearchResult, IssueQuery } from '../github';

export interface SearchModel {
    term: string;
    result: SearchResult<Repo>;
};

export interface RepoCacheModel {
    [repoName: string]: {
        isFetching: boolean; 
        repo: Repo;
        issues: IssueQuery;
    };
} 

export interface RepoDetailModel {
    selectedRepo: string;
}

export interface Model {
    ver: number;
    error: string;
    search: SearchModel; 
    repoDetail: RepoDetailModel;
    repoCache: RepoCacheModel;
}

