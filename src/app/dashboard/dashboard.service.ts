import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

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
        coverImage: 'https://www.antelliq.com/media/wysiwyg/antelliq/pho-pet-care-what-we-do.png'
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
