import { AbstractControl } from '@angular/forms';

export function WhiteSpaceValidator(control: AbstractControl) {
    if (/^\s/.test(control?.value)) {
        control.setValue('', { emitEvent: false });
        return { required: true }
    };
    return null;
}

export function NumberOnlyValidator(control: AbstractControl) {
    if (control?.value && /\D/.test(control.value)) {
        const newValue = control.value.replace(/\D/, '');
        control.setValue(newValue, { emitEvent: false });
        return newValue.length ? null : { required: true }
    };
    return null;
}