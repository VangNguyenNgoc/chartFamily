import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  NgForm,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NodeService } from '../../../../services/node';
import { Location } from '@angular/common';
@Component({
  selector: '.form-update',
  templateUrl: './formUpdate.component.html',
  styleUrls: ['./formUpdate.component.css'],
})
export class FormUpdateComponent {
  title = 'form update data';

  @ViewChild('formUpdateImage', { static: false }) formUpdateImage:
    | ElementRef
    | undefined;
  constructor(
    private http: HttpClient,
    private nodeService: NodeService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder
  ) {}
  errorMsg: any;
  images: any;

  personUpdate = {
    name: '',
    image: '',
    filenameImage: '',
    birthday: '',
    deathday: '',
    mySelect: '',
  };

  listData: any; //= this.personUpdate.mySelect;

  formUpdate = new FormGroup({
    name: new FormControl(this.personUpdate.name),
    image: new FormControl(this.personUpdate.image),
    filenameImage: new FormControl(this.personUpdate.filenameImage),
    mySelect: new FormControl(null),
    birthday: new FormControl(this.personUpdate.birthday),
    deathday: new FormControl(this.personUpdate.deathday),
  });

  data: any;
  personData: any;
  selected: string = '';
  ngOnInit(): void {
    let id = localStorage.getItem('idNode') || '{}';
    this.nodeService.getDataById(id)?.subscribe((res: any) => {
      this.personUpdate.name = res.Node.idPerson.name;
      this.personUpdate.image = res.Node.idPerson.image;
      this.personUpdate.filenameImage = res.Node.idPerson.filenameImage;
      this.personUpdate.mySelect = res.Node.idPerson.parent;
      this.listData = res.dataResult;
      this.personUpdate.birthday = res.Node.idPerson.birthday;
      this.personUpdate.deathday = res.Node.idPerson.deathday;
    });
  }
  selectChange(value: string) {
    //In my case $event come with a id value

    this.personUpdate.mySelect = value;
  }
  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }
  update() {
    if (this.formUpdate.valid) {
      const name = this.formUpdate.value.name || '';
      const birthday = this.formUpdate.value.birthday || '';
      const deathday = this.formUpdate.value.deathday || '';
      const image =
        this.images === 'undefined'
          ? this.personUpdate.image
          : this.images || '';
      const parent = this.personUpdate.mySelect || '';
      const formData = new FormData();
      formData.append('formUpdateImage', image);
      formData.append('name', name);
      formData.append('birthday', birthday);
      formData.append('deathday', deathday);

      this.nodeService.updateNode(formData, parent).subscribe((res: any) => {
        this.router.navigate(['/'], { relativeTo: this.route }).then(() => {
          localStorage.removeItem('idNode');
          window.location.reload();
        });
      });
    } else {
      this.errorMsg = 'Name, birthday is required!';
    }
  }

  open() {}

  close() {
    this.router.navigate(['/'], { relativeTo: this.route });
  }
}
