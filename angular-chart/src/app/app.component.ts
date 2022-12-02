import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { NodeService } from '../services/node';
import { PersonService } from '../services/person';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private nodeService: NodeService,
    private personService: PersonService
  ) {}
  title = 'Browser market shares at a specific website, 2014';
  type = 'OrgChart';
  data = [
    ['Firefox', 45.0],
    ['IE', 26.8],
    ['Chrome', 12.8],
    ['Safari', 8.5],
    ['Opera', 6.2],
    ['Others', 0.7],
  ];
  columnNames = ['Browser', 'Percentage'];
  options = {};
  width = 550;
  height = 400;
  faUndo = faUndo;

  token = localStorage.getItem('token');

  checkLogin() {
    if (this.token) {
    }
  }

  deleteNode() {
    const idNode = localStorage.getItem('idNode');
    if (idNode) {
      if (confirm('Are you sure delete node?')) {
        this.nodeService.deleteNode(idNode).subscribe((res: any) => {
          console.log(res, 'res');
          localStorage.setItem('idNode', '');
          // this.router.navigate(['/'], { relativeTo: this.route });
          window.location.reload();
        });
      }
    }
  }

  divorce() {
    const idNode = localStorage.getItem('idNode') || '';
    const index = Number(localStorage.getItem('index'));
    const element = document.querySelectorAll('.positionCSS');

    console.log('element', element[index].children[1]);
    if (element[index].children[1] == undefined) {
      alert('The node is not have couple!');
    } else {
      const idCouple = element[index].children[1].getAttribute('data-id') || '';

      if (idNode != '' && idCouple != '') {
        const conf = confirm('Are you sure divorce couple?');
        if (conf) {
          this.personService
            .divorce(idNode, { idCouple })
            .subscribe((res: any) => {
              console.log(res, 'res');
              localStorage.removeItem('idNode');
              localStorage.removeItem('index');
              this.router
                .navigate(['/'], { relativeTo: this.route })
                .then(() => {
                  console.log('load dirvoce');

                  window.location.reload();
                });
            });
        }
      }
    }
  }

  logout() {
    localStorage.removeItem('idNode');
    localStorage.removeItem('token');
    this.router.navigate(['/login'], { relativeTo: this.route }).then(() => {
      window.location.reload();
    });
  }
}
