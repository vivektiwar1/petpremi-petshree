import { Component, OnInit, Input } from '@angular/core';
import { Lightbox, IAlbum } from 'ngx-lightbox';
import { ImagesPerPage } from 'src/app/app.constant';
import { AuthImagePipe } from 'src/app/pipes/auth-image.pipe';

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
  galleryImages: Array<IAlbum>;


  constructor(
    private lightBox: Lightbox,
    private authImage: AuthImagePipe
  ) { }

  async ngOnInit() {
    this.totalItems = this.imageList.length;
    this.galleryImages = await this.transformImageList() as Array<IAlbum>;
  }

  openGallery(index: number): void {
    this.lightBox.open(this.galleryImages, index, {
      alwaysShowNavOnTouchDevices: true,
      fitImageInViewPort: true,
      centerVertically: true,
      showImageNumberLabel: true,
      wrapAround: true,
    });
  }

  async transformImageList() {
    const images = this.imageList.map(async item => {
      const imageAsDataURI = await this.authImage.transform(item.thumb);
      return {
        caption: item.caption,
        src: imageAsDataURI,
        thumb: imageAsDataURI
      }
    })
    return Promise.all(images);
  }

  close(): void {
    this.lightBox.close();
  }

}
