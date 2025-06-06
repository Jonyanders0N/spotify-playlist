import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CallbackComponent } from './callback/callback.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'callback', component: CallbackComponent},
    {path: 'search', component: SearchComponent}
];
