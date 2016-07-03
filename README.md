# reactive-angular2
A simple client-only github frontend using [angular2](https://angular.io/) and [redux](http://redux.js.org/)-inspired reactive data flow with [rxjs](http://reactivex.io/).

## Live example

Check out the [live sample](https://pzahoran.github.io/reactive-angular2-live/).

## Quick start

```bash
# clone the repo
git clone https://github.com/pzahoran/reactive-angular2.git

# change into the repo directory
cd reactive-angular2

# install
npm install

# run
npm start
```

Then visit [http://localhost:8000](http://localhost:8000) in your browser.

## GitHub rate limit

GitHub imposes a rate limit of 60 requests per hour on unauthenticated users (see [details](https://developer.github.com/v3/#rate-limiting)). To lift that limit create a personal authentication token on [GitHub](https://github.com/settings/tokens/new) and specify it as the `githubtoken` in `reactive-angular2/src/config.json`

```javascript
{
    // uncomment the line below and ad your github token to raise github rate limit for unauthenticated users
    "githubtoken": <your github token here>
}
```

## License
 [MIT](/LICENSE.md)

