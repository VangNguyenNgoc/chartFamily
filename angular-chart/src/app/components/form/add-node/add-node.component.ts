import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs';
import { NodeService } from 'src/services/node';
import { SocketService } from 'src/services/socket';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-node',
  templateUrl: './add-node.component.html',
  styleUrls: ['./add-node.component.css'],
})
export class FormAddNodeComponent implements OnInit {
  data: any[]; //1 2
  filteredData: any[]; //Observable
  inputAddNode = new FormControl();

  idData: any;
  constructor(
    private nodeService: NodeService,
    private socketService: SocketService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.nodeService.getNodeNotChildren().subscribe((result: any) => {
      if (result?.data) {
        this.data = result.data;
        this.filteredData = result.data;
      }

      this.inputAddNode.valueChanges
        .pipe(debounceTime(500))
        .subscribe((res) => {
          this.socketService.setupSocketConnection();
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

  public optionSelectedNode(event: MatAutocompleteSelectedEvent): any {
    this.inputAddNode.setValue(event.option.viewValue);

    this.idData = event.option.value;
  }

  submitAddNode(e: Event) {
    let params = this.idData;
    let idParent = localStorage.getItem('idNode') || '';
    const idAccount = localStorage.getItem('idAccount') || '';
    if (idParent != '' && idAccount != '') {
      this.socketService.sendMessage(idAccount, params);

      this.socketService.messageReceived();
      console.log('abc');
    }
    this.nodeService
      .addNodeChildren(params, idParent)
      .subscribe((result: any) => {
        localStorage.removeItem('idNode');
        this.router.navigate(['/'], { relativeTo: this.route }).then(() => {
          window.location.reload();
        });
      });
  }
}
