import { Routes } from '@angular/router';
import { <%= classify(name) %>EditComponent } from './<%=dasherize(name)%>-edit/<%=dasherize(name)%>-edit.component';

export const <%=name.toUpperCase()%>_ROUTES: Routes = [
  {
    path: '<%=pluralize(name)%>/:id',
    component: <%= classify(name) %>EditComponent
  }
];
