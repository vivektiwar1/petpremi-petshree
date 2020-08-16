import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { assert } from 'console';

@Pipe({
  name: 'authImage'
})
export class AuthImagePipe implements PipeTransform {

  constructor(
    private http: HttpClient
  ) {}

  async transform(value: string) {
    try {
      const imageBlob = await this.http.get(value, {
        responseType: 'blob'
      }).toPromise();

      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageBlob);
      });

    } catch (error) {
      return 'assets/images/fallback.jpg';
    }
  }

}
