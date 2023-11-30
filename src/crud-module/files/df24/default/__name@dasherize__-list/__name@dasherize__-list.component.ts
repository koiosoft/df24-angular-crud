import { Component, OnInit } from '@angular/core';
import { <%= classify(name) %>Filter } from '../<%=dasherize(name)%>-filter';
import { <%= classify(name) %>Service } from '../<%=dasherize(name)%>.service';
import { <%= classify(name) %> } from '../<%=dasherize(name)%>';

@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: '<%=dasherize(name)%>-list.component.html',
  styles: [
    // todo: figure out how to make width dynamic
    'table { min-width: 600px }',
  ]
})
export class <%= classify(name) %>ListComponent implements OnInit {

  title = '<%=model.title%>';
  subTitle = 'dashboard';
  processing = false;
  searchText = '';

  gridTitle = 'Manage <%=model.title%>s';
  gridSummary = 'That is the summary for this model dashboard, please change this.';

  displayedColumns = [<% for (let field of model.fields) { %>'<%=field.name%>',<% } %>'actions'];
  filter = new <%= classify(name) %>Filter();
  selected<%=classify(name)%>!: <%= classify(name) %>;
  feedback: any = {};

  constructor(private <%=camelize(name)%>Service: <%= classify(name) %>Service) {
  }

  ngOnInit() {
    this.search();
  }


  get <%=camelize(name)%>List(): <%= classify(name) %>[] {
    return this.<%=camelize(name)%>Service.getList();
  }


  search(): void {
    this.processing = true;
    this.<%=camelize(name)%>Service.reset();
    this.<%=camelize(name)%>Service.search(this.searchText, () => {
      this.processing = false;
    },
    (err: any) => {
      this.processing = false;
      this.feedback = {
        type: 'danger',
        message: 'Error loading data from server.',
      };
    });
  }

  next(): void {
    this.processing = true;
    this.<%=camelize(name)%>Service.next(this.searchText, () => {
      this.processing = false;
    },
    (err: any) => {
      this.processing = false;
      this.feedback = {
        type: 'danger',
        message: 'Error loading data from server.',
      };
    });
  }

  select(selected: <%= classify(name) %>): void {
    this.selected<%= classify(name) %> = selected;
  }

  delete(<%=camelize(name)%>: <%= classify(name) %>): void {
    if (confirm('Are you sure?')) {
      this.processing = true;
      this.<%=camelize(name)%>Service.delete(<%=camelize(name)%>).subscribe({
        next: () => {
          this.processing = false;
          this.feedback = {type: 'success', message: 'Delete was successful!'};
          setTimeout(() => {
            this.feedback = {};
            this.search();
          }, 1000);
        },
        error: err => {
          this.processing = false;
          this.feedback = {type: 'danger', message: 'Error deleting.'};
          setTimeout(() => {
            this.feedback = {};
          }, 2000);
        }
      });
    }
  }

  hasMorePages() {
    return this.<%=camelize(name)%>Service.hasMorePages();
  }
}
