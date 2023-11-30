import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { <%= classify(name) %>Service } from '../<%=dasherize(name)%>.service';
import { <%= classify(name) %> } from '../<%=dasherize(name)%>';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-<%=dasherize(name)%>-edit',
  templateUrl: './<%=dasherize(name)%>-edit.component.html',
  styles: [
    // todo: figure out how to make width dynamic
    'form { display: flex; flex-direction: column; min-width: 500px; }',
    'form > * { width: 100% }'
  ]
})
export class <%=classify(name)%>EditComponent implements OnInit {
  createMode = true;
  title = '<%=model.title%>';
  subTitle = 'info';
  saving = true;

  gridTitle = '';
  gridSummary = 'That is the summary for this update form, please change this.';

  id!: string;
  <%=camelize(name)%>!: <%=classify(name)%>;
  feedback: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private <%=camelize(name)%>Service: <%=classify(name)%>Service) {
  }

  updateGridTitle() {
    this.gridTitle = `${this.createMode ? 'New' : 'Update'} Hotel`;
  }


  ngOnInit() {
    this.updateGridTitle();
    this
      .route
      .params
      .pipe(
        map(p => p['id']),
        switchMap(id => {
          if (id === 'new') { return of(new <%=classify(name)%>()); }
          this.createMode = false;
          this.updateGridTitle();
          return this.<%=camelize(name)%>Service.findById(id);
        })
      )
      .subscribe({
        next: <%=camelize(name)%> => {
          this.<%=camelize(name)%> = <%=camelize(name)%>;
          this.feedback = {};
          this.saving = false;
        },
        error: err => {
          this.feedback = {type: 'warning', message: 'Error loading'};
          this.saving = false;
        }
      });
  }

  save() {
    this.feedback = {};
    this.saving = true;
    this.<%=camelize(name)%>Service.save(this.<%=camelize(name)%>).subscribe({
      next: <%=camelize(name)%> => {
        this.saving = false;
        this.<%=camelize(name)%> = <%=camelize(name)%>;
        this.feedback = {type: 'success', message: 'Save was successful!'};
        setTimeout(async () => {
          this.feedback = {};
        }, 2000);
      },
      error: err => {
        this.saving = false;
        this.feedback = {type: 'warning', message: 'Error saving'};
      }
    });
  }

  async cancel() {
    await this.router.navigate(['/<%=pluralize(name)%>']);
  }
}
