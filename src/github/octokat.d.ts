declare module "octokat" {
    function O(q:{token:string, plugins?: Array<any>}):O.Octokat;
    export = O;

    namespace O {
        type Url = string;
        type Sha = string;

        interface Octokat {
            search: {
                repositories: Query<SearchParam<"stars" | "forks" | "updated">, SearchResult<Repo>>;
                code: Query<SearchParam<"indexed">, SearchResult<any>>;
                issues: Query<SearchParam<"comments" | "created" | "updated">, SearchResult<any>>;
                users: Query<SearchParam<"followers" | "repositories" | "joined">, SearchResult<User>>;
            }
            repos(owner: string, repoName: string): RepoQuery;
            users(username: string): UserQuery;
            issues: Query<any, List<Issue>>;
            user: Query<any, User>;
        }

        interface Query<O,R> {
            fetch(options?: O): Promise<R>;
            fetchAll(options?: O): Promise<R>;
            read(options?: O): Promise<string>;
            url: Url;
        }
        
        interface ListQuery<ID,O,R> extends Query<O,ListQuery<ID,O,R>>, List<R> {
            (id: ID): Query<O,R>;
            previousPage?: ListQuery<ID,O,R>;
            nextPage?: ListQuery<ID,O,R>
            firstPage?: ListQuery<ID,O,R>
            lastPage?: ListQuery<ID,O,R>
        } 

        interface Single {
            id: number;
            url: Url;
            html: Query<any, any>;
            htmlUrl: Url;
        }

        interface List<T> {
            items: T[];
            url: Url;
        }

        interface SearchParam<Field> {
            q: string;
            sort?: Field;
            order?: "asc" | "desc";
        }

        interface SearchResult<T> extends List<T> {
            totalCount: number;
            incompleteResults: boolean;
        }

        interface UserQuery extends Query<any, User> {
            events: ListQuery<any, any, any>;
            followers: Query<any, List<User>>;
            following: Query<any, List<User>>;
            gists: Query<any, List<any>>;
            keys: Query<any, List<any>>;
            orgs: Query<any, List<any>>;
            receivedEvents: Query<any, List<any>>;
            repos: Query<any, List<Repo>>;
            starred: Query<any, List<any>>;
        }

        interface User extends Single, UserQuery {
            avatar: Query<any, any>;
            avatarUrl: Url;
            followersUrl: Url;
            gravatarId: string;
            login: string;
            organizations: Query<any, List<any>>;
            organizationsUrl: Url;
            receivedEventsUrl: Url;
            reposUrl: Url;
            siteAdmin: boolean;
            subscriptions: Query<any, List<any>>;
            subscriptionsUrl: Url;
            type: "Organization" | "User";
        }

        interface Branch {
            commit: {
                sha: Sha;
                url: Url;
            }
            name: string;
        }

        interface Comment extends Single {
            body: string;
            comitId: string;
            createdAt: Date;
            line: number;
            path: string;
            position: number;
            updatedAt: Date;
        }

        interface CommitQuery extends ListQuery<any, any, Commit> {
            comments: Query<any, List<Comment>>;
            status: Query<any, any>;
            statuses: Query<any, List<any>>;
        } 

        interface UserCommit {
            name: string;
            email: string;
            date: Date;
        }

        interface Commit extends Single, CommitQuery {
            sha: Sha;
            commit: {
                url: Url;
                author: UserCommit;
                committer: UserCommit;
            }
            message: string;
            tree: {
                url: Url;
                sha: Sha;
            }
            commentCount: number;
            verification: {
                verified: boolean;
                reason: string;
                signature: string;
                payload: string;
            }
            author: User;
            committer: User;
            parents: {
                url: Url;
                sha: Sha;
            }[];
        }

        interface RepoQuery extends Query<any, Repo> {
            assignees: Query<any, List<User>>;
            branches: Query<any, List<Branch>>;
            collaborators: Query<any, List<User>>;
            comments: Query<any, List<Comment>>;
            commits: Query<any, List<any>>;
            compare: Query<any, any>;
            contents: Query<any, List<any>>;
            contributors: Query<any, List<User>>;
            deployments: Query<any, List<any>>;
            downloads: Query<any, List<any>>;
            events: Query<any, List<any>>;
            git: Query<any, any>;
            hooks: Query<any, List<any>>;
            issues: IssueQuery;
            labels: Query<any, List<any>>;
            languages: Query<any, any>;
            merges: Query<any, any>;
            notifications: Query<any, List<any>>;
            pages: Query<any, List<any>>;
            pulls: Query<any, List<any>>;
            readme: Query<any, any>;
            releases: Query<any, List<any>>;
            stargazers: Query<any,List<User>>;
            stats: Query<any,List<any>>;
            statuses: Query<any, List<any>>;
            subscribers: Query<any, List<User>>;
            subscription: Query<any, any>;
            tags: Query<any, List<any>>;
            tarball: Query<any, any>;
            teams: Query<any, List<any>>;
            zipball: Query<any, any>;
        }

        interface Repo extends Single, RepoQuery {
            archive(): Query<any, any>;
            blobs: Query<any, List<any>>;
            clone: Query<any, any>;
            cloneUrl: Url;
            contributorsUrl: Url;
            createdAt: Date;
            defaultBranch: string;
            deploymentsUrl: Url;
            description: string;
            downloadsUrl: string;
            eventsUrl: string;
            fork: boolean;
            forks: number;
            forksCount: number;
            forksUrl: Url;
            fullName: string;
            gitCommits: Query<any, List<any>>;
            gitRefs: Query<any, List<any>>;
            gitTags: Query<any, List<any>>;
            gitUrl: Url;
            hasDownloads: boolean;
            hasIssues: boolean;
            hasPages: boolean;
            hasWiki: boolean;
            homepage: Url;
            hooksUrl: Url;
            issueComment: Query<any, List<any>>;
            issueEvents: Query<any, List<any>>;
            keys: Query<any, List<any>>;
            language: string;
            languagesUrl: Url;
            mergesUrl: Url;
            milestones: ListQuery<number, any, List<Milestone>>;
            mirror: Query<any, any>;
            mirrorUrl: Url;
            name: string;
            openIssues: number;
            openIssuesCount: number;
            owner: User;
            private: boolean;
            pushedAt: Date;
            score: number;
            size: number;
            ssh: Query<any, any>;
            sshUrl: Url;
            stargazersCount: number;
            stargazersUrl: Url;
            subscribersUrl: Url;
            subscriptionUrl: Url;
            svn: Query<any, any>;
            svnUrl: Url;
            tagsUrl: Url;
            teamsUrl: Url;
            trees: Query<any, List<any>>;
            updatedAt: Date;
            watchers: number;
            watchersCount: number;
        }

        type IssueQuery = ListQuery<number, IssueQueryParams, Issue>;

        type IssueState = "open" | "closed";

        interface IssueQueryParams {
            milestone?: number | "*" | "none";
            state?: IssueState | "all";
            assignee?: string | "*" | "none";
            creator?: string;
            mentioned?: string;
            labels?: string;
            sort?: "created" | "updated" | "comments";
            direction?: "asc" | "desc";
            sice?: Date;
        }

        interface Issue extends Single {
            assingee: User;
            body: string;
            closedAt: Date;
            comments: number;
            commentsUrl: Url;
            events: ListQuery<any, any, any>;
            eventsUrl: Url;
            labels: [{
                color: string;
                name: string;
                url: Url;
            }];
            locked: boolean;
            milestone?: Milestone;
            number: number;
            repository: Query<any, Repo>;
            repositoryUrl: Url;
            state: IssueState;
            title: string;

            pullRequest?: {
                diff: Query<any, any>;
                diffUrl: Url;
                html: Query<any, any>;
                htmlUrl: Url;
                patch: Query<any, any>;
                patchUrl: Url;
                url: Url;
            }

            user: User;
            createdAt: Date;
            updatedAt: Date;
        }

        interface Milestone extends Single {
            id: number,
            number: number,
            state: IssueState,
            title: string,
            description: string,
            creator: User,
            openIssues: number,
            closedIssues: number,
            createdAt: Date,
            updatedAt: Date,
            closedAt: Date,
            dueOn: Date
        }
    }
}
