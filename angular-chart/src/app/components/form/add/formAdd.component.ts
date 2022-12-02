import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NodeService } from '../../../../services/node';
import { SocketService } from '../../../../services/socket';
// import { Location } from '@angular/common';
import {
  MatRadioButton,
  MatRadioChange,
  MAT_RADIO_DEFAULT_OPTIONS,
} from '@angular/material/radio';

@Component({
  selector: '.form-add',
  templateUrl: './formAdd.component.html',
  styleUrls: ['./formAdd.component.css'],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
  ],
})
export class FormAddComponent implements OnInit {
  title = 'form data';

  @ViewChild('formAddImage', { static: false }) formAddImage:
    | ElementRef
    | undefined;
  // fileUploadForm: FormGroup | undefined;
  // fileInputLabel: string | undefined;

  constructor(
    private http: HttpClient,
    private nodeService: NodeService,
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private formBuilder: FormBuilder // private socket: Socket
  ) {}

  errorMsg: any;
  images: any;
  radioSelect: any;
  listValueRadio: string[] = ['Male', 'Female'];
  formAdd = new FormGroup({
    name: new FormControl('', Validators.required),
    image: new FormControl(''),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    gender: new FormControl(''),
    birthday: new FormControl('', Validators.required),
    deathday: new FormControl(''),
  });
  ngOnInit(): void {
    this.socketService.setupSocketConnection();
  }

  pageRefresh() {
    location.reload();
  }

  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
    }
  }
  onRadioChange(mrChangeRadio: MatRadioChange) {
    this.radioSelect = mrChangeRadio.value;
    console.log('value change radio', this.radioSelect);
  }
  // sendNodeNotification(message: any) {
  //   this.socket.emit('new_notification', {
  //     message: message,
  //   });
  // }
  add() {
    const idAccount = localStorage.getItem('idAccount') || '';
    this.socketService.sendMessage(idAccount, '123456789123');

    if (this.formAdd.valid) {
      const name = this.formAdd.value.name || '';
      const username = this.formAdd.value.username || '';
      const password = this.formAdd.value.password || '';
      const gender = this.radioSelect || '';
      const birthday = this.formAdd.value.birthday || '';
      const deathday = this.formAdd.value.deathday || '';
      const image = this.images || '';

      const parent = localStorage.getItem('idNode') || '';
      const mother = localStorage.getItem('idMother') || '';

      const formData = new FormData();
      formData.append('formAddImage', image);
      formData.append('name', name);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('gender', gender);
      formData.append('birthday', birthday);
      formData.append('deathday', deathday);
      formData.append('parent', parent);
      formData.append('mother', mother);
      this.nodeService.addNode(formData).subscribe((res: any) => {
        console.log('res', res);
        if (res.success == false) {
          this.errorMsg = 'username is already in use';
        } else {
          alert('Register successfully!');
          let token = localStorage.getItem('token');
          //redirect
          localStorage.removeItem('idNode');
          localStorage.removeItem('idMother');
          if (token) {
            this.router.navigate(['/'], { relativeTo: this.route }).then(() => {
              window.location.reload();
            });
          } else {
            this.router
              .navigate(['/login'], { relativeTo: this.route })
              .then(() => {
                window.location.reload();
              });
          }
        }
      });
    } else {
      this.errorMsg = 'Name, birthday is required!';
    }
  }

  close() {
    this.router.navigate(['/'], { relativeTo: this.route });
  }
}
