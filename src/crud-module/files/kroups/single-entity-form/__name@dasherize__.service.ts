
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { <%= classify(name) %> as DataType } from './<%=dasherize(name)%>';

const headers = new HttpHeaders().set('Accept', 'application/json');
const _limit = 5;

@Injectable()
export class <%= classify(name) %>Service {
  private url = '<%= model.api.url %>';
  private defaultId: string = '';

  constructor(private http: HttpClient) {
    this.defaultId = 'replace-with-id-of-identity';
  }

  findById(id?: string): Observable<DataType> {
    const url = `${this.url}/${id??this.defaultId}`;
    const params = { };
    return this.http.get<DataType>(url, { params, headers });
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

}
