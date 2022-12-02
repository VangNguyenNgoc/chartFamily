import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from 'src/services/person';
import { debounceTime } from 'rxjs';
@Component({
  selector: 'app-wedding',
  templateUrl: './wedding.component.html',
  styleUrls: ['./wedding.component.css'],
})
export class WeddingComponent implements OnInit {
  data: any[]; //1 2
  filteredData: any[]; //Observable
  inputWedding = new FormControl();
  idData: any;
  constructor(
    private http: HttpClient,
    private personService: PersonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.personService.getDataCanWedding().subscribe((result: any) => {
      if (result?.data) {
        this.data = result.data;
        this.filteredData = result.data;
      }

      this.inputWedding.valueChanges
        .pipe(debounceTime(500))
        .subscribe((res) => {
          this.filteredData = this.data
            .filter((x) => x.name.toLowerCase().includes(res.toLowerCase()))
            .sort((x: any, y: any) => {
              if (x?.name?.startsWith(res)) return -1;
              if (y?.name?.startsWith(res)) return 1;
              return 0;
            });
        });
    });
  }
  getDataCanWedding() {
    this.personService.getDataCanWedding().subscribe((res: any) => {
      this.router.navigate(['/'], { relativeTo: this.route }).then(() => {
        localStorage.removeItem('idNode');
        window.location.reload();
      });
    });
  }
  public optionSelectedNode(e: MatAutocompleteSelectedEvent): any {
    console.log(e);
    this.inputWedding.setValue(e.option.viewValue);
    this.idData = e.option.value;
  }

  submitWedding(e: Event) {
    let idObject = localStorage.getItem('idNode') || '';
    let dataWedding = this.idData;
    console.log('dataWedding', dataWedding);
    console.log('idObject', idObject);

    this.personService
      .wedding(idObject, { dataWedding })
      .subscribe((res: any) => {
        console.log('res', res);
        localStorage.removeItem('idNode');
        this.router.navigate(['/'], { relativeTo: this.route }).then(() => {
          window.location.reload();
        });
      });
  }
}
