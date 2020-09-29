import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {SlickService} from '../shared/services/slick.service';
import lottie, {AnimationItem} from 'lottie-web';
import {AppStore} from '../app.store';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('container') container: ElementRef;
  private subscriptions: Subscription[];

  data: { slides: any, classList: any, activated: { pet: number, slides?: number } } = {
    slides: [{
      pet: {
        1: '/assets/json/breed/pet1.json',
        2: '/assets/json/breed/pet2.json'
      },
      human: '/assets/json/breed/human.json',
    }, {
      pet: {
        1: '/assets/json/symptom/pet1.json',
        2: '/assets/json/symptom/pet2.json'
      },
      human: '/assets/json/symptom/human.json',
    }],
    classList: {
      0: {
        pet: {
          1: 'pet pet-dog',
          2: 'pet pet-cat'
        },
        human: 'human'
      },
      1: {
        pet: {
          1: 'pet pet-dog',
          2: 'pet pet-cat'
        },
        human: 'human'
      }
    },
    activated: {
      pet: null,
    }
  };
  animations: { [index: number]: { pet: { [index: number]: AnimationItem }, human: AnimationItem } } = {};

  constructor(public store: AppStore,
              public slick: SlickService) {
  }

  ngOnInit(): void {
    this.subscriptions = [
      this.store.state$.subscribe(state => this.changePet(state.pet)),
    ];
  }

  changePet(pet, skipStop = false) {
    const activatedSlide = this.data.activated.slides || 0;
    if (!this.animations[activatedSlide]) {
      return;
    }
    if (!skipStop) {
      this.stopPetLotte();
    }
    const properties = this.data.slides[activatedSlide];
    const animationObject = this.animations[activatedSlide];
    const container = this.container.nativeElement.querySelector('.slick-track')
      .children[activatedSlide]
      .querySelector('.pet-animation');
    if (!animationObject.pet[pet.id]) {
      animationObject.pet[pet.id] = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: properties.pet[pet.id],
        rendererSettings: {
          className: `${this.data.classList[activatedSlide].pet[pet.id] || ''} pet-animation-${pet.id}`
        }
      });
    } else {
      const e = container.querySelector(`.pet-animation-${pet.id}`);
      if (e) {
        e.classList.remove('hide');
      }
      animationObject.pet[pet.id].play();
    }

    this.animations = {
      ...this.animations,
      [activatedSlide]: {...animationObject}
    };

    this.data.activated = {
      ...this.data.activated,
      pet: pet.id,
    };
  }

  private stopPetLotte() {
    const activatedSlide = this.data.activated.slides || 0;
    const activatedPet = this.data.activated.pet;
    const animationObject = this.animations[activatedSlide];
    if (animationObject && activatedPet && animationObject.pet[activatedPet]) {
      animationObject.pet[activatedPet].stop();
      this.container.nativeElement.querySelector('.slick-track')
        .querySelectorAll(`.pet-animation .pet`).forEach(element => element.classList.add('hide'));
    }
  }

  loadSlide(slideIndex = 0) {
    if (this.data.slides[0]) {
      const preActivatedSlide = this.data.activated.slides;
      if (preActivatedSlide) {
        const animationObj = this.animations[preActivatedSlide];
        if (animationObj && animationObj.human) {
          animationObj.human.stop();
        }
        this.stopPetLotte();
      }

      const properties = this.data.slides[slideIndex];
      const container = this.container.nativeElement.querySelector('.slick-track').children[slideIndex];
      const animationObject = this.animations[slideIndex] || {pet: {}, human: null};

      if (!animationObject.human) {
        animationObject.human = lottie.loadAnimation({
          container: container.querySelector('.human-animation'),
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: properties.human,
          rendererSettings: {
            className: this.data.classList[slideIndex].human
          }
        });
      } else {
        animationObject.human.play();
      }

      this.animations = {
        ...this.animations,
        [slideIndex]: {...animationObject}
      };

      this.data.activated = {
        ...this.data.activated,
        slides: slideIndex
      };

      const pet = this.store.state.pet;
      if (pet) {
        this.changePet(pet, true);
      }
    }
  }

  ngAfterViewInit(): void {
    this.loadSlide();
  }

  ngOnDestroy(): void {
    for (const animation in this.animations) {
      if (this.animations.hasOwnProperty(animation)) {
        this.animations[animation].human.destroy();
        const pets = this.animations[animation].pet;
        for (const pet in pets) {
          if (pets.hasOwnProperty(pet)) {
            pets[pet].destroy();
          }
        }
      }
    }
    if (this.subscriptions) {
      this.subscriptions.forEach(s => s && s.unsubscribe());
    }
  }
}
