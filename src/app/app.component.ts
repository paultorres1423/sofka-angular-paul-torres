import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ModalService} from './services/modal.service';
import {ModalComponent} from './shared/modal/modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sofka-angular-paul-torres';
}
