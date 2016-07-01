import { Repo, SearchResult, IssueQuery } from '../github';

export interface ErrorAction { er: string }

export function isError(action: Action): action is ErrorAction {
    return (action as ErrorAction).er !== undefined;
}

export class DismissError {}
export class SearchAction { constructor(public term: string) {} }
export class SearchResultAction extends DismissError { constructor(public result: SearchResult<Repo>) {super()} }
export class ErrorFetchingSearchResultAction { constructor(public er: string) {} }
export class SelectRepoAction { constructor(public owner: string, public repo: string) {} }
export class RepoFetchedAction extends DismissError { constructor(public repoName: string, public repo: Repo, public issues: IssueQuery) {super()} }
export class ErrorFetchingRepoAction { constructor(public repoName: string, public er: string) {} }
export class FetchMoreIssuesAction { constructor(public repoName: string) {} }
export class MoreIssuesFetchedAction extends DismissError { constructor(public repoName: string, public issues: IssueQuery) {super()} }
export class ErrorFetchingMoreIssuesAction { constructor(public repoName: string, public er: string) {} }

export type Action = 
    DismissError
    | SearchAction 
    | SearchResultAction 
    | SelectRepoAction 
    | RepoFetchedAction
    | ErrorFetchingRepoAction
    | FetchMoreIssuesAction
    | ErrorFetchingMoreIssuesAction
;

