import { Component, OnInit, Inject } from '@angular/core';
import { NodeService } from '../../../services/node';
import { convertDate } from '../../../utils/convertDate';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
declare var google: any;
var people: any = [];
var flag: boolean = false;
@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.css'],
})
export class OrgChartComponent implements OnInit {
  readData: any;
  private dialogRef: any;

  constructor(
    private nodeService: NodeService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  //ng g c chart/org-chart
  //https://developers.google.com/chart/interactive/docs/gallery/orgchart
  async ngOnInit(): Promise<void> {
    google.charts.load('current', { packages: ['orgchart'] });
    google.charts.setOnLoadCallback(drawChart);
    this.nodeService.getData().subscribe(
      async (res: any) => {
        console.log('res', res);

        people = res.Person;
        this.readData = res.Person;
      },
      (err) => {
        if (err.message === 'Please login.') {
          this.router.navigate(['/login'], { relativeTo: this.route });
        }
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      }
    );
    function drawChart() {
      var data = new google.visualization.DataTable();
      var results = [];
      let item;
      data.addColumn('string', 'Name');
      data.addColumn('string', 'Parent');
      data.addColumn('string', 'Comment');
      for (let index = 0; index < people.length; index++) {
        console.log(people[index]);

        const element = people[index];
        const birthdayConvert = new Date(element.birthday);
        const birthday = birthdayConvert.getFullYear();
        const deathday =
          element.deathday === null
            ? '?'
            : new Date(element.deathday).getFullYear();

        const dataCouple = element.idNode.idCouple;
        if (
          dataCouple &&
          dataCouple.length > 0 &&
          dataCouple[dataCouple.length - 1]?.status == true
        ) {
          // console.log('idCouple', element.idNode);
          // console.log(element.idNode.idCouple.length);

          let dataCoupleLast = dataCouple[dataCouple.length - 1].id.idPerson;
          console.log('dataCouple', dataCouple);
          console.log('dataCoupleLast', dataCoupleLast);

          const birthdayConvertCouple = new Date(dataCoupleLast.birthday);
          const birthdayCouple = birthdayConvert.getFullYear();
          const deathdayCouple =
            dataCoupleLast.deathday === null
              ? '?'
              : new Date(dataCoupleLast.deathday).getFullYear();

          item = [
            {
              v: element.idNode._id,
              f: `<div id="${element._id}" class="positionCSS row" data-id="${index}">
                    <div class="col-sm-6">
                      <img src="${element.image}" width="50" height="50"> 
                      <div>${element.name}</div>
                      <div>${birthday} - ${deathday}</div>
                    </div>
                    <div class="col-sm-6" data-id="${dataCoupleLast._id}">
                      <img src="${dataCoupleLast.image}" width="50" height="50"> 
                      <div>${dataCoupleLast.name}</div>
                      <div>${birthdayCouple} - ${deathdayCouple}</div>
                    </div>  
                  </div>
              `,
            },
            element.idNode.parent,
            'The President',
          ];
        } else {
          item = [
            {
              v: element.idNode._id,
              f: `<div id="${element._id}" class="positionCSS">
                    <div style="white-space:nowrap">
                      <img src="${element.image}" width="50" height="50">
                      <div>${element.name}</div>
                      <div>${birthday} - ${deathday}</div>
                    </div>
                  </div>
              `,
            },
            element.idNode.parent,
            'The President',
          ];
        }
        results.push(item);
      }
      data.addRows(results);

      // Create the chart.
      var chart = new google.visualization.OrgChart(
        document.getElementById('chart_div')
      );

      google.visualization.events.addListener(chart, 'select', () => {
        //index of row chart
        const indexRow = chart.getSelection()[0].row;
        if (chart.getSelection().length > 0) {
          const idMother =
            people[indexRow].idNode.idCouple[
              people[indexRow].idNode.idCouple.length - 1
            ];
          console.log("people[indexRow]", people[indexRow]);
          
          localStorage.setItem('idNode', people[indexRow].idNode._id);
          if (idMother != undefined) {
            localStorage.setItem('idMother', idMother.id._id);
          }
          localStorage.setItem('index', indexRow);
        } else {
          localStorage.removeItem('idNode');
        }
      });
      close();
      // Draw the chart, setting the allowHtml option to true for the tooltips.
      chart.draw(data, { allowHtml: true });
    }
  }
}
