import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { PageEvent } from '@angular/material/paginator';
import { <%= classify(name) %>Service  as DataService } from '../<%=dasherize(name)%>.service';
import { <%= classify(name) %> as DataType } from '../<%=dasherize(name)%>';

const DEFAUL_ERROR_LOADING_MESSAGE = 'Error loading data from server.';
const DEFAUL_ERROR_DELETE_MESSAGE = 'Error deleting data from server.';
const DEFAUL_SUCCESS_DELETE_MESSAGE = 'Delete was successful!';
const MESSAGE_TYPE_DANGER = 'danger';
const MESSAGE_TYPE_SUCCESS = 'success';
const DEFAULT_CONFIRMATION_MESSAGE = 'Are you sure?';
const DEFAULT_LOADING_MESSAGE = 'loading data...';
const DEFAULT_NOT_RECORDS_FOUND = 'No records found';

@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: '<%=dasherize(name)%>-list.component.html',
  styles: [
    'table { min-width: 600px } ',
    `
      .mtx-grid {
        border: 0px;
      }
    `,
  ],
})
export class <%= classify(name) %>ListComponent implements OnInit {

  title = '<%=model.title%>';
  gridTitle = 'Manage <%=model.title%>s';
  
  columns: MtxGridColumn[] = [<% for (let field of model.fields) { %>
      {
        header: '<%=field.label%>',
        field: '<%=field.name%>',<% if(field.type && field.type !== 'string'){ %>
        type: '<%=field.type%>',<%}%><% if(field.display && field.display.grid && field.display.grid.width ){ %>
        width: '<%=field.display.grid.width%>',<%}%><% if(field.display && field.display.grid && field.display.grid.hide ){ %>
        hide: true,<%}%>
      },<% } %> 
      { header: 'Actions', field: 'actions' }
  ];
  
  isLoading = false;
  subTitle = 'dashboard';
  searchText = '';
  gridSummary = 'That is the summary for this model dashboard, please change this.';
  selectedItem!: DataType;
  feedback: any = {};

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.search();
  }

  get pagination() {
    return {
      index: this.dataService.getIndex() - 1,
      size: this.dataService.getPageSize(),
    };
  }

  get collection(): DataType[] {
    return this.dataService.getList();
  }

  get total(): number {
    return this.dataService.getTotal();
  }

  loadSuccessfully() {
    this.isLoading = false;
  }

  loadFailed(err: any, message?: string, callback?: () => void) {
    this.isLoading = false;
    this.feedback = {
      type: MESSAGE_TYPE_DANGER,
      message: message ?? (err as Error).message,
    };
    if (callback) {
      callback();
    }
  }

  getNextPage(e: PageEvent) {
    this.isLoading = true;
    this.dataService.search(
      this.searchText,
      () => {
        this.loadSuccessfully();
      },
      (err: any) => this.loadFailed(err, DEFAUL_ERROR_LOADING_MESSAGE),
      e.pageIndex + 1
    );
  }

  search(): void {
    this.dataService.reset();
    this.isLoading = true;
    this.dataService.search(
      this.searchText,
      () => this.loadSuccessfully(),
      (err: any) => this.loadFailed(err, DEFAUL_ERROR_LOADING_MESSAGE),
      1
    );
  }

  select(selected: DataType): void {
    this.selectedItem = selected;
  }

  deleteSuccessfully() {
    this.isLoading = false;
    this.feedback = {
      type: MESSAGE_TYPE_SUCCESS,
      message: DEFAUL_SUCCESS_DELETE_MESSAGE,
    };
    setTimeout(() => {
      this.feedback = {};
      this.search();
    }, 1000);
  }

  delete(item: DataType): void {
    if (confirm(DEFAULT_CONFIRMATION_MESSAGE)) {
      this.isLoading = true;
      this.dataService.delete(item).subscribe({
        next: () => this.deleteSuccessfully(),
        error: (err) =>
          this.loadFailed(
            err,
            DEFAUL_ERROR_DELETE_MESSAGE,
            () => (this.feedback = {})
          ),
      });
    }
  }

  hasMorePages() {
    return this.dataService.hasMorePages();
  }

  get notResultText() {
    if (this.isLoading) {
      return DEFAULT_LOADING_MESSAGE;
    }
    return DEFAULT_NOT_RECORDS_FOUND;
  }
}
