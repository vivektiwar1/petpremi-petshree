import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { of, Observable, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private _navActive$: Subject<string> = new Subject();
  constructor(
    private http: HttpClient
  ) { }

  getActiveNav(): Observable<string> {
    return this._navActive$.asObservable();
  }

  setNavActive(anchorId: string) {
    this._navActive$.next(anchorId);
  }

  getUserDetails(): Observable<any> {
    //return this.http.get('url here')
    return of({
      data: {
        clinicName: 'Pet & Vet Clinic',
        businessAddress: 'K-2, Brahmaputra Shopping Complex, Sector 29, Noida',
        timings: {
          days: 'Monday - Saturday',
          time: [
            '10:00 AM - 01:00 PM',
            '06:00 PM - 09:00 PM'
          ]
        },
        phone: '7827836303',
        whatsAppPhone: '+91-9711405054',
        email: 'rishi14sood@yahoo.co.in',
        name: 'Dr. Rishi Sood',
        profession: 'Veterinarian',
        fbLink: '',
        whatsAppLink: '',
        youtubeLink: '',
        instagamLink: '',
        twitterLink: '',
        avatar: 'https://www.justlifelogo.com/wp-content/uploads/2016/09/pet-care-dog-logo-for-sale.jpg',
        coverImage: 'https://www.antelliq.com/media/wysiwyg/antelliq/pho-pet-care-what-we-do.png',
        images: [
          "https://wolftracker9eee.blob.core.windows.net/wolfpictures-mock/wolf1.png",
          "https://wolftracker9eee.blob.core.windows.net/wolfpictures-mock/wolf2.png",
          "https://wolftracker9eee.blob.core.windows.net/wolfpictures-mock/wolf3.png",
          "https://wolftracker9eee.blob.core.windows.net/wolfpictures-mock/wolf4.png",
          "https://wolftracker9eee.blob.core.windows.net/wolfpictures-mock/wolf5.png",
          "https://wolftracker9eee.blob.core.windows.net/wolfpictures-mock/wolf6.png",
          "https://wolftracker9eee.blob.core.windows.net/wolfpictures-mock/wolf8.png",
          "https://wolftracker9eee.blob.core.windows.net/wolfpictures-mock/wolf9.png",
          "https://wolftracker9eee.blob.core.windows.net/wolfpictures-mock/wolf1.png",
          "https://wolftracker9eee.blob.core.windows.net/wolfpictures-mock/wolf1.png",
          "https://wolftracker9eee.blob.core.windows.net/wolfpictures-mock/wolf2.png",
        ]
      },
      status: 200
    }).pipe(
      delay(2000)
    );
  }

  postEnquiry(apiData) {
    //return this.http.post('url here', apiData);
  }
}
