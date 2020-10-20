import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';

export const validateAllFormFields = (formGroup: FormGroup) => Object.keys(formGroup.controls).forEach(field => {
  const control = formGroup.get(field);
  if (control instanceof FormControl) {
    control.markAsTouched({onlySelf: true});
  } else if (control instanceof FormGroup) {
    validateAllFormFields(control);
  }
});

export class CustomValidators {
  /**
   * @desc function to check password and confirm password matched or not.
   * @param AC : FormGroup of password.
   * @return boolean: true or false
   */
  static passwordMatchValidator(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    const confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if (((password !== '') && (password !== null)) && ((confirmPassword === '') || (confirmPassword === null))) {
      AC.get('confirmPassword').setErrors({required: true});
    } else if (password !== confirmPassword) {
      AC.get('confirmPassword').setErrors({MatchPassword: true});
    } else {
      AC.get('confirmPassword').setErrors(null);
    }
    return null;
  }

  static userNameValidator(FC: FormControl) {
    const username = FC.value;
    if (username) {
      if (FieldRegEx.NUMBER.test(username)) {
        if (!FieldRegEx.PHONE.test(username)) {
          return {invalidPhone: true};
        }
      } else {
        if (CustomValidators.hasWhiteSpace(FC.value)) {
          return {username: true};
        }
        return null;
      }
    }
    return Validators.required(FC);
  }

  static countryMobileValidator(countriesSubject: BehaviorSubject<{ fromLength: number, toLength: number }[]>): ValidatorFn {
    return (control: FormGroup) => {
      const countryIndex = control.get('countryIndex').value;
      const countries = countriesSubject.value;
      const country = countries && countries[countryIndex];
      if (country) {
        const mobile = control.get('mobile');
        const validators = [
          Validators.minLength(country.fromLength),
          Validators.maxLength(country.toLength),
          Validators.pattern(FieldRegEx.PHONE),
          Validators.required,
        ];
        /*if (control.get('email').value.length === 0) {
          validators.push(Validators.required);
          if (mobile.value.length === 0) {
            mobile.setErrors({required: true});
          }
        } else {
          let errors = mobile.errors;
          if (errors && errors.required) {
            if (Object.keys(mobile.errors).length > 1) {
              delete errors.required;
            } else {
              errors = null;
            }
            mobile.setErrors(errors);
          }
        }*/
        mobile.setValidators(validators);
      }
      return null;
    };
  }

  static hasWhiteSpace(s) {
    return /\s/g.test(s);
  }
}

export const FieldRegEx = {
  NAME: '[a-zA-Z ]*',
  NUMBER: /^\d+$/,
  PHONE: /^[1-9][0-9]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{0,}$/
  // EMAIL_OR_PHONE: '/^((.+@.+\\..+)|[1-9]{1}[0-9]{9})$/',
};

export const PWD_VALIDATORS = [
  Validators.minLength(8),
  Validators.maxLength(10),
  Validators.pattern(FieldRegEx.PASSWORD),
];
