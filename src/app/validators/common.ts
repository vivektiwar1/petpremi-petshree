import { AbstractControl } from '@angular/forms';

export function WhiteSpaceValidator(control: AbstractControl) {
    if (/^\s/.test(control?.value)) {
        control.setValue('', { emitEvent: false });
        return { required: true }
    };
    return null;
}