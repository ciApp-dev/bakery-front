import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../service/loading-service';

@Component({
  selector: 'app-loading-screen',
  imports: [],
  templateUrl: './loading-screen.html',
  styleUrl: './loading-screen.css',
})
export class LoadingScreen {
  readonly loadingService = inject(LoadingService);
}
