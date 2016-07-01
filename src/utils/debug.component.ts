import { Component, Inject } from '@angular/core';
import { GitHubService } from '../github';
import * as _ from './merge';

@Component({
  selector: 'debug',
  template: `
    <form (ngSubmit)="run(qqq.value)" class="navbar-form navbar-left">
        <div class="form-group">
            <input type="text" #qqq class="form-control"/>
        </div>
        <button type="submit" class="btn btn-primary">Eval</button>
    </form>
  `,
})
export class Debug {
  constructor(@Inject(GitHubService) private githubservice: GitHubService) {}

  run(q: string) {
      var e = "(function unnamed(octo, _){return "+q+";})";
      console.dir(q);
      try { 
        var r = eval(e);
        r = r(this.githubservice.octo, _);
        console.dir(r);
        if(r && r.then) r.then((o:any)=> {
          console.log("async from " + q);
          console.dir(o);
        }); 
      } catch(er) {
        console.dir(er);
      }
  }
}
