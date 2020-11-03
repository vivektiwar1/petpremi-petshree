import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {AuthService} from "../../../shared/services/auth.service";
import $ from 'jquery';

@Injectable()
export class ECardService implements OnInit {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    // private renderer: Renderer2
  ) {
  }

  /*  scrollEvent = new Subject<boolean>();
    @ViewChild('scrollTopElement') scrollTopElement: ElementRef;
    ngOnInit(): void {
      this.scrollEvent.pipe(debounceTime(1)).subscribe(() => this.setPosition());
    }

    setPosition(): void {
      if (this.scrollTopElement) {
        if (window.pageYOffset < (0.3 * window.innerHeight)) {
          this.renderer.addClass(this.scrollTopElement.nativeElement, 'hide');
        } else {
          this.renderer.removeClass(this.scrollTopElement.nativeElement, 'hide');
        }
      }
    }*/

  private _navActive$: Subject<string> = new Subject();

  ngOnInit(): void {
  }

  showDiv() {
    this.auth.checkAndLogin().then(() => this.auth.getUserProfile());
    var x_top: any = document.getElementsByClassName("cdk-global-scrollblock");
    if (x_top[0]) {
      x_top[0].style.top = "auto";
    }
    document.getElementById('appointmenttime').style.display = "block";
    // document.getElementById('appointment').style.display = "none";
    document.getElementById('home').style.display = "none";
    if (document.getElementById('gallery') && document.getElementById('videos')) {
      document.getElementById('gallery').style.display = "none";
      document.getElementById('videos').style.display = "none";
    }
    document.getElementById('enquiry').style.display = "none";


  }

  getActiveNav(): Observable<string> {
    return this._navActive$.asObservable();
  }

  scrollTop() {
    $('html, body').animate({scrollTop: 0}, 0);
  }

  setNavActive(anchorId: string) {
    this._navActive$.next(anchorId);
  }

  private getApiUrl(url: string): string {
    return url.includes('oauth2')
      ? `${environment.apiBase}${url}`
      : `${environment.apiBase}/service/api${url}`;
  }

  getUserDetails(userName, partnerUserName): Observable<any> {

    return this.http.get(this.getApiUrl(`/e/card/details?userName=${userName}&partnerUserName=${partnerUserName}`), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getUserDetail(userName): Observable<any> {

    return this.http.get(this.getApiUrl(`/e/card/details?userName=${userName}`), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getPartnerData() {
    const apiData = {
      commonParamHash: {
        entityName: "Partner",
        uiBean: "BNEPartnerCard",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 1
        },
        sort: {
          DESC: [
            "id"
          ]
        }
      },
      objectHash: {
        userName: "rahul"
      }
    };
    return this.http.post(this.getApiUrl(`/crud`), apiData);

  }
  bookAppointments() {
    const apiData = {
      appointmentReasonId: 1,
      appointmentReasonOthers: "no reason",
      appointmentTypeId: 1,
      attendantId: 1,
      partnerId: 1,
      petId: 1,
      clinicId: 1,
      customerId: 1,
      occurrence: 1,
      appointmentRepeatId: 1,
      date: "2020-10-16",
      fromTime: "7:00:12 Pm",
      toTime: "8:30:12 Pm"
    };
    return this.http.post(`${environment.apiBase}/service/api/crud`, apiData);
  }

  getCustomerDetails() {
    const data = JSON.parse(localStorage.getItem('userData'));
    const apiData = {
      commonParamHash: {
        entityName: "User",
        uiBean: "BNECustomerProfile",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          DESC: [
            "id"
          ]
        }
      },
      objectHash: {
        id: data?.id
      }
    };
    return this.http.post(this.getApiUrl(`/crud`), apiData);

  }
  getCustomer(customerData) {
    const data = JSON.parse(localStorage.getItem('userData'));

    const apiData = {
      commonParamHash: {
        entityName: "User",
        uiBean: "BNECustomer",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          DESC: [
          ]
        }
      },
      objectHash: {
        fullName_LIKE: customerData.firstName + customerData.lastName,
        country_FK: {
          id: 1
        },
        mobile_LIKE: customerData.mobile,
        email_LIKE: customerData.email,
        authorities_FK: {
          name: "ROLE_CUSTOMER"
        }
      }
    };
    return this.http.post(this.getApiUrl(`/crud`), apiData);
  }

  getVets() {
    const apiData = {
      commonParamHash: {
        entityName: "User",
        uiBean: "BNECustomer",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          DESC: [
            "id"
          ]
        }
      },
      objectHash: {
        partners_FK: { "id": 11 },
        profession_FK: { "id": 1 }
      }
    };
    return this.http.post(this.getApiUrl(`/crud`), apiData);

  }



  getBreedType(typeId?, pageSize = 10, pageNumber = 0, sort?) {
    const apiData = {
      commonParamHash: {
        entityName: "PetBreed",
        uiBean: "BNEPetBreed",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          ASC: [
            "id"
          ]
        }
      },
      objectHash: {
        status: true
      }
    };
    return this.http.post(this.getApiUrl(`/crud`), apiData);
  }

  getPetType(pageSize = 10, pageNumber = 0, sort?, searchHash?) {
    const apiData = {
      commonParamHash: {
        entityName: 'PetType',
        uiBean: 'BNEPetType',
        operation: 'SEARCH',
        pagination: {
          pageNumber,
          pageSize
        },
        sort: {
          ASC: [
            'id'
          ]
        }
      },
      objectHash: {
        status: true
      }
    };
    return this.http.post(`${environment.apiBase}/service/api/crud`, apiData);
  }


  getDay(): Observable<any> {
    const apiData = {
      commonParamHash: {
        entityName: "Day",
        uiBean: "BNEDay",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          ASC: [
            "id"
          ]
        }
      },
      objectHash: {
        status: true
      }
    };
    return this.http.post(this.getApiUrl(`/crud`), apiData);
  }
  getAppointmentReason() {
    const apiData = {
      commonParamHash: {
        entityName: "AppointmentReason",
        uiBean: "BNEAppointmentReason",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          DESC: [
            "id"
          ]
        }
      },
      objectHash: {
        active: true
      }
    };
    return this.http.post(this.getApiUrl(`/crud`), apiData);

  }
  getPetDetails() {
    const apiData = {

      commonParamHash: {
        entityName: "User",
        uiBean: "BNECustomer",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          DESC: [
          ]
        }
      },
      objectHash: {

        userName: "aniket"
      }
    };
    return this.http.post(`${environment.apiBase}/service/api/crud`, apiData);

  }

  getAppointmentRepeat() {
    const apiData = {
      commonParamHash: {
        entityName: "AppointmentRepeat",
        uiBean: "BNEAppointmentRepeat",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          DESC: [
            "id"
          ]
        }
      },
      objectHash: {
        active: true,
      }
    };
    return this.http.post(this.getApiUrl(`/crud`), apiData);

  }

  getAppointmentType() {
    const apiData = {

      commonParamHash: {
        entityName: "AppointmentType",
        uiBean: "BNEAppointmentType",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          DESC: [
            "id"
          ]
        }
      },
      objectHash: {
        active: true
      }
    };
    return this.http.post(this.getApiUrl(`/crud`), apiData);

  }


  postEnquiry(apiData) {
    console.log(apiData.phone)

    if (!apiData.phone) {
      delete apiData.phone;
    }
    console.log(apiData)

    return this.http.put(this.getApiUrl('/enquiry/partner'), apiData);
  }

  getCountries() {
    const apiData = {
      commonParamHash: {
        entityName: 'Country',
        operation: 'SEARCH'
      },
      objectHash: {
        status: true
      }
    };

    return this.http.post(this.getApiUrl('/crud'), apiData);
  }

  getGenders() {
    const apiData = {
      commonParamHash: {
        entityName: 'Gender',
        uiBean: 'BNEGender',
        operation: 'SEARCH',
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          ASC: [
            'id'
          ]
        }
      },
      objectHash: {
        status: true
      }
    };

    return this.http.post(this.getApiUrl('/crud'), apiData);
  }


  getWeightUnits() {
    const apiData = {
      commonParamHash: {
        entityName: 'WeightUnit',
        uiBean: 'BNEWeightUnit',
        operation: 'SEARCH',
        pagination: {
          pageNumber: 0,
          pageSize: 10
        },
        sort: {
          ASC: [
            'id'
          ]
        }
      },
      objectHash: {
        status: true
      }
    };

    return this.http.post(this.getApiUrl('/crud'), apiData);
  }


  getTitles() {
    const apiData = {
      commonParamHash: {
        entityName: 'Title',
        operation: 'SEARCH'
      },
      objectHash: {
        status: true
      }
    };
    return this.http.post(this.getApiUrl('/crud'), apiData);
  }

  getMediaFiles(userName, type) {
    const apiData = {
      commonParamHash: {
        entityName: "UserDocument",
        uiBean: "BNEUserDocument",
        operation: "SEARCH",
        pagination: {
          pageNumber: 0,
          pageSize: 6
        },
        sort: {
          ASC: [
            "displayOrder"
          ]
        }
      },
      objectHash: {
        user_FK: {
          userName: userName
        },
        documentType_FK: {
          documentType: type
        }
      }
    };
    return this.http.post(this.getApiUrl('/crud'), apiData);
  }

  getImageLinks(userName, type, fileName = '') {
    return this.getApiUrl(`/assets/partner/e/card?userName=${userName}&asset=${type}&fileName=${fileName}`);
  }
}
