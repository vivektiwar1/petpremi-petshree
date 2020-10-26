import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-appointmentdetails',
  templateUrl: './appointmentdetails.component.html',
  styleUrls: ['./appointmentdetails.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {
  @Input() appointmentReason: any;
  @Input() petDetails: any;
  @Input() appointmentType: any;
  @Input() appointmentRepeat: any;
  @Input() userDetails: any;
  @Input() bookAppointment: any;
  Details:FormGroup;
  reason:any;
  type:any;
  petId:any;
  petName:any;
  
  constructor(
    private matDialog: MatDialog,
    private formBuilder: FormBuilder,
  ) {
    this.Details=this.formBuilder.group({
      reason:['',Validators.required],
      type:['',Validators.required]
    })

    this.Details.get('reason').valueChanges.subscribe(data=>{
      this.reason=data;
    })

    this.Details.get('type').valueChanges.subscribe(data=>{
      this.type=data
    })

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
  showDiv() {
    document.getElementById('appointmentdetails').style.display = "none";
    document.getElementById('petdetails').style.display = "block";
  }
  back() {
    document.getElementById('appointmenttime').style.display = "block";
    document.getElementById('appointmentdetails').style.display = "none";
  }

  scrollBack(element: HTMLDivElement) {
    element.scrollTo({
      top: 0,
      left: element.scrollLeft - (element.firstElementChild as HTMLDivElement).offsetWidth,
      behavior: 'smooth'
    });
  }
  
  scrollForward(element: HTMLElement) {
    element.scrollTo({
      top: 0,
      left: element.scrollLeft + (element.firstElementChild as HTMLDivElement).offsetWidth,
      behavior: 'smooth'
    });
  }
  petDetail(petImage){
    this.petId=petImage.id
    this.petName=petImage.name
    
  }
}
