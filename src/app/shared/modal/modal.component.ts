import {Component} from '@angular/core';
import {ModalService} from '../../services/modal.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [
    NgClass
  ],
  templateUrl: './modal.component.html',
  styles: ``
})
export class ModalComponent {

  constructor(
    public readonly modalService: ModalService
  ) {
  }

}
