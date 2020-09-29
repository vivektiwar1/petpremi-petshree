import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import Cropper from 'cropperjs';
import {toBase64} from '../../../shared/helpers/image.helper';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

const ALLOWED_TYPES = {
  'image/png': true,
  'image/jpg': true,
  'image/jpeg': true,
};

@Component({
  selector: 'app-crop-picture',
  styleUrls: ['./crop-picture.component.scss'],
  templateUrl: './crop-picture.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CropPictureComponent implements AfterViewInit, OnDestroy, OnInit {
  loader$ = new BehaviorSubject(false);
  base64$ = new BehaviorSubject(null);
  error$ = new BehaviorSubject<string>(null);
  resize$ = new Subject<boolean>();
  file = null;

  private instance: Cropper = null;
  private subscription: Subscription;

  @Input() set image(file: File) {
    if (ALLOWED_TYPES[file.type]) {
      this.file = file;
    } else {
      this.error$.next('error.file_type');
    }
  }

  @Output() cropped = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<boolean>();
  @ViewChild('imageContainer') imageContainer: ElementRef<HTMLImageElement>;

  ngOnInit(): void {
    if (!this.file) {
      this.cancel.next(true);
    }
    this.subscription = this.resize$.pipe(debounceTime(300)).subscribe(() => {
      this.instance.destroy();
      this.initialize();
    });
  }

  ngAfterViewInit(): void {
    if (this.file) {
      this.loader$.next(true);
      toBase64(this.file).then(e => this.base64$.next(e), () => {
        this.loader$.next(false);
        this.error$.next('error.feature_support');
      });
    }
  }

  imageLoaded({target: img}) {
    if ((img.height < 300 && (img.width < 300 || img.height < 100)) ||
      (img.width < 300 && (img.height < 300 || img.width < 100))) {
      this.loader$.next(false);
      this.error$.next('error.file_size_small');
    } else {
      this.initialize();
    }
  }

  imageLoadError() {
    this.loader$.next(false);
    this.error$.next('error.file_load');
  }

  ngOnDestroy(): void {
    if (this.instance) {
      this.instance.destroy();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  close() {
    this.cancel.next(true);
  }

  croppedIImage() {
    if (this.instance) {
      this.loader$.next(true);
      this.cropped.next(this.instance.getCroppedCanvas().toDataURL(this.file.type));
    }
  }

  initialize() {
    this.instance = new Cropper(this.imageContainer.nativeElement, {
      aspectRatio: 1,
      zoomable: false,
      ready: (event: CustomEvent<any>) => {
        this.loader$.next(false);
      }
    });
  }

  @HostListener('window:resize', [])
  resize() {
    if (this.instance) {
      this.resize$.next(true);
    }
  }
}
