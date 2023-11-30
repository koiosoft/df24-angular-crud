
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { <%= classify(name) %> as DataType } from './<%=dasherize(name)%>';

const headers = new HttpHeaders().set('Accept', 'application/json');
const _limit = 5;

@Injectable()
export class <%= classify(name) %>Service {
  private total: number = -1;
  private list: DataType[] = [];
  private url = '<%= model.api.url %>';
  private page: number = 1;

  constructor(private http: HttpClient) {}

  getList() {
    return this.list;
  }

  reset() {
    this.list = [];
    this.page = 1;
  }

  findById(id: string): Observable<DataType> {
    const url = `${this.url}/${id}`;
    const params = { id: id };
    return this.http.get<DataType>(url, { params, headers });
  }

  private _search(search: string, _page?: number) {
    const params = {
      q: search,
      _page: _page ?? this.page,
      _limit,
    };
    return this.http.get<DataType[]>(this.url, {
      params,
      headers,
      observe: 'response',
    });
  }

  search(
    searchText: string,
    onComplete = () => {},
    onFail = (err: any) => {},
    _page?: number
  ): void {
    this._search(searchText, _page).subscribe({
      next: (response) => {
        this.total = Number(response.headers.get('X-Total-Count'));
        if (response.body?.length! > 0) {
          if (_page) this.page = _page;
          this.list = response.body ?? [];
        }
      },
      error: (err) => {
        onFail(err);
      },
      complete: onComplete,
    });
  }

  save(entity: DataType): Observable<DataType> {
    let params = new HttpParams();
    let url = '';
    if (entity.id) {
      url = `${this.url}/${entity.id.toString()}`;
      params = new HttpParams().set('ID', entity.id.toString());
      return this.http.put<DataType>(url, entity, { headers, params });
    } else {
      url = `${this.url}`;
      return this.http.post<DataType>(url, entity, { headers, params });
    }
  }

  delete(entity: DataType): Observable<DataType> {
    let params = new HttpParams();
    let url = '';
    if (entity.id) {
      url = `${this.url}/${(entity.id + 100).toString()}`;
      params = new HttpParams().set('ID', (entity.id + 100).toString());
      return this.http.delete<DataType>(url, { headers, params });
    }
    return EMPTY;
  }

  hasMorePages() {
    return this.list.length < (this.total > -1 ? this.total : _limit);
  }

  getTotal(): number {
    return this.total;
  }

  getPageSize() {
    return _limit;
  }
  getIndex() {
    return this.page;
  }
}
