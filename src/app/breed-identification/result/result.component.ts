import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreedService} from '../breed.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import $ from 'jquery';

@Component({
  selector: 'app-breed-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss', '../breed-identification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultBreedComponent implements OnDestroy, OnInit {
  selectedIndex = 0;
  list = [
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
    'https://via.placeholder.com/300x300',
  ];
  subscriptions: Subscription[];
  @ViewChild('resultContainer') resultContainer: ElementRef;

  constructor(private service: BreedService,
              private router: Router,
              private e: ElementRef) {
  }


  ngOnInit(): void {
    this.subscriptions = [
      this.service.backPressed$.subscribe(() => this.goBack())
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s && s.unsubscribe());
  }

  goBack() {
    this.router.navigateByUrl('/breed-identification').catch(() => {
    });
  }

  searchImage(item) {
    this.list = [
      item,
      ...this.list
    ];
    this.scrollToResult();
  }

  searchPet(pet) {
    console.log(pet);
    this.scrollToResult();
  }

  showInfo(index) {
    this.selectedIndex = index;
  }

  scrollToResult() {
    const parent = $(window.innerWidth > 991 ? this.e.nativeElement : 'html, body');
    parent.animate({
      scrollTop: $(this.resultContainer.nativeElement).offset().top - parent.offset().top
    }, 800);
  }
}
