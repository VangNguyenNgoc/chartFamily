import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleChartsModule } from 'angular-google-charts';
import { AppComponent } from './app.component';
import { OrgChartComponent } from './chart/org-chart/org-chart.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormAddComponent } from './components/form/add/formAdd.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AppRoutingModule } from '../app/app-routing.module';
import { NodeService } from '../services/node';
import { FormUpdateComponent } from './components/form/update/formUpdate.component';
import { MatSelectModule } from '@angular/material/select';
import { FormLoginComponent } from './components/authen/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormAddNodeComponent } from './components/form/add-node/add-node.component';
import { WeddingComponent } from './components/form/wedding/wedding.component';

@NgModule({
  declarations: [
    AppComponent,
    OrgChartComponent,
    FormAddComponent,
    FormUpdateComponent,
    FormLoginComponent,
    FormAddNodeComponent,
    WeddingComponent,
  ],
  imports: [
    BrowserModule,
    GoogleChartsModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatBadgeModule,
    FormsModule,
    MatInputModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatAutocompleteModule,
    CommonModule,
  ],
  providers: [
    { provide: ActivatedRoute, useValue: {} },
    { provide: NodeService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
