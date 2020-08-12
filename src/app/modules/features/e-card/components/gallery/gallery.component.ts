import { Component, OnInit, Input } from '@angular/core';
import { Lightbox, IAlbum } from 'ngx-lightbox';
import { ImagesPerPage } from 'src/app/app.constant';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  @Input() imageList: Array<IAlbum>;
  currentPage: number = 1;
  totalItems: number = 1;
  readonly imagesPerPage = ImagesPerPage;

  constructor(
    private lightBox: Lightbox,
  ) { }

  ngOnInit(): void {
    this.totalItems = this.imageList.length;
    console.log(this.imageList);
  }

  openGallery(index: number): void {
    this.lightBox.open(this.imageList, index, {
      alwaysShowNavOnTouchDevices: true,
      fitImageInViewPort: true,
      centerVertically: true,
      showImageNumberLabel: true,
      wrapAround: true,
    });
  }

  close(): void {
    this.lightBox.close();
  }

}
