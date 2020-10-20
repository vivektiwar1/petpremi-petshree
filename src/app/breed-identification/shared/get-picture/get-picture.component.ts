import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-get-picture',
  templateUrl: './get-picture.component.html',
  styleUrls: ['./get-picture.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GetPictureComponent implements OnInit {
  error$ = new BehaviorSubject('');
  @Output() closed = new EventEmitter<boolean>();
  @Output() captured = new EventEmitter<any>();
  @ViewChild('player') player: ElementRef;
  canvas = document.createElement('CANVAS') as HTMLCanvasElement;

  constructor() {
    this.canvas.height = 400;
    this.canvas.width = 400;
  }

  ngOnInit(): void {
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          aspectRatio: 1,
        }
      }).then((stream) => {
        (this.player.nativeElement as HTMLVideoElement).srcObject = stream;
      }, () => this.error$.next('error.camera_permission'));
    } else {
      this.error$.next('error.camera_support');
    }
  }

  capture() {
    if (!this.error$.value) {
      const ctx = this.canvas.getContext('2d');
      ctx.drawImage(this.player.nativeElement, 0, 0, 400, 400);
      this.captured.next(this.canvas.toDataURL('image/png'));
    }
    this.close();
  }

  close() {
    if (this.player && this.player.nativeElement.srcObject) {
      this.player.nativeElement.srcObject.getVideoTracks().forEach(track => track.stop());
    }
    this.closed.emit(true);
  }
}
