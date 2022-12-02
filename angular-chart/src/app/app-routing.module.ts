import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { OrgChartComponent } from './chart/org-chart/org-chart.component';
import { FormAddComponent } from './components/form/add/formAdd.component';
import { FormUpdateComponent } from './components/form/update/formUpdate.component';
import { FormAddNodeComponent } from './components/form/add-node/add-node.component';
import { FormLoginComponent } from './components/authen/login/login.component';
import { WeddingComponent } from './components/form/wedding/wedding.component';
import { CommonModule } from '@angular/common';
const routes: Routes = [
  { path: 'create', component: FormAddComponent },
  { path: 'register', component: FormAddComponent },
  { path: 'login', component: FormLoginComponent },
  { path: 'update', component: FormUpdateComponent },
  { path: 'addNode', component: FormAddNodeComponent },
  { path: 'wedding', component: WeddingComponent },
  { path: '', component: OrgChartComponent },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
    CommonModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
