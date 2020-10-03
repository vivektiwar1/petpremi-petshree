import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { NumberOnlyValidator, WhiteSpaceValidator } from 'src/app/validators/common';
import { EcardDetailsService } from './ecard-details.service';

@Component({
  selector: 'app-ecard-details',
  templateUrl: './ecard-details.component.html',
  styleUrls: ['./ecard-details.component.scss']
})
export class EcardDetailsComponent implements OnInit {

  mediaForm: FormGroup;
  documentTypes: Array<any>;
  galleryDocId: any;
  youtubeDocId: any;
  userId: any;

  apiInProgress = {
    page: false,
    mediaForm: false,
    image: new Set()
  };

  constructor(
    private commonService: CommonService,
    private ecardDetailsService: EcardDetailsService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  async ngOnInit(): Promise<void> {
    this.apiInProgress.page = true;
    try {
      [
        this.documentTypes,
        this.userId,
      ] = await Promise.all([
        this.commonService.getDocumentType(),
        this.commonService.getUserId(),
      ]);

      const documents = await this.ecardDetailsService.getDocuments(this.userId).toPromise();
      console.log(documents)
      this.galleryDocId = (this.documentTypes.find(item => item.name === 'gallery') || {})['value'];
      this.youtubeDocId = (this.documentTypes.find(item => item.name === 'youtube') || {})['value'];
      this.apiInProgress.page = false;

      this.createMediaForm(documents);
    } catch (error) {
      console.error(error)
      this.apiInProgress.page = false;
    }
  }

  createMediaForm(formData) {
    this.mediaForm = this.formBuilder.group({
      media: this.formBuilder.array([
        ...(formData?.length ? formData.map(item => this.createMediaFormGroup(item)) : [this.createMediaFormGroup()])
      ])
    })

    this.addDisplayOrderValidator();
  }

  createMediaFormGroup(formData?) {
    const mediaFormGroup = this.formBuilder.group({
      title: [formData?.title ? formData.title : null, Validators.compose([Validators.required, WhiteSpaceValidator])],
      docTypeId: [{ value: formData?.docTypeId ? formData.docTypeId : null, disabled: formData?.id ? true : false }, Validators.compose([Validators.required, NumberOnlyValidator])],
      displayOrder: [formData?.displayOrder ? formData.displayOrder : null],
      videoCode: [formData?.videoCode ? formData.videoCode : null],
      image: [formData?.image ? formData.image : null],
      id: [formData?.id ? formData.id : null],
      documentNumber: [formData?.documentNumber ? formData.documentNumber : null]
    });

    const docTypeControl = mediaFormGroup.get('docTypeId');
    const videoCodeControl = mediaFormGroup.get('videoCode');

    docTypeControl.valueChanges.subscribe(value => {
      if (value == this.youtubeDocId) {
        videoCodeControl.setValidators([Validators.required, WhiteSpaceValidator]);
      } else {
        videoCodeControl.clearValidators();
      }
      videoCodeControl.updateValueAndValidity();
    });

    return mediaFormGroup;
  }

  addDisplayOrderValidator() {
    this.mediaFormArray.forEach((mediaFormGroup: FormGroup) => {
      const displayOrderControl = mediaFormGroup.get('displayOrder') as FormControl;
      let enforceUniqueIdValidator = this.enforceUniqueId(mediaFormGroup.get('id').value)
      displayOrderControl.setValidators(Validators.compose([NumberOnlyValidator, enforceUniqueIdValidator.bind(this)]));
      displayOrderControl.updateValueAndValidity()
    });
  }

  enforceUniqueId(id) {
    return function (control: AbstractControl) {
      if (control?.value) {
        for (let formGroup of this.mediaFormArray) {
          const formData = (formGroup as FormGroup).value;
          if (id !== formData.id && formData.displayOrder == control.value) {
            return { uniqueOrder: true };
          }
        }
        return null;
      } else {
        return {required: true};
      }
    }
  }

  async addMediaForm() {
    const control = this.mediaForm.get('media') as FormArray;
    const formGroup = control.get('0') as FormGroup;
    if (!formGroup.get('id').value) await this.addMediaMetaData(formGroup);
    control?.insert(0, this.createMediaFormGroup());
    this.addDisplayOrderValidator();
  }

  removeMediaForm(index) {
    const control = this.mediaForm.get('media') as FormArray;
    control.removeAt(index);
  }

  get mediaFormArray() {
    return (this.mediaForm.get('media') as FormArray)?.controls
  }

  async addMediaMetaData(mediaForm: FormGroup) {
    try {
      this.apiInProgress.mediaForm = true;
      const formData = {
        ...mediaForm.value,
        displayOrder: +mediaForm.value.displayOrder
      };
      formData?.docTypeId == this.galleryDocId && delete formData.videoCode;
      delete formData.image;
      delete formData.documentNumber;
      !formData?.id && delete formData.id;
      const response = await this.ecardDetailsService.addDocument(formData).toPromise() as any;
      mediaForm.patchValue({
        id: response?.id,
        documentNumber: response?.documentNumber
      });
      this.toastr.success('Added Successfully!');
      mediaForm.markAsPristine();
      this.apiInProgress.mediaForm = false;
    } catch (error) {
      this.toastr.error('Unable to add!');
      this.apiInProgress.mediaForm = false;
    }

  }

  async updateMediaMetadata(mediaForm: FormGroup | AbstractControl) {
    try {
      this.apiInProgress.mediaForm = true;
      const formData = {
        ...mediaForm.value,
        displayOrder: +mediaForm.value.displayOrder
      };
      formData?.docTypeId == this.galleryDocId && delete formData.videoCode;
      delete formData.image;
      delete formData.documentNumber;
      await this.ecardDetailsService.updateDocument(formData).toPromise() as any;
      this.toastr.success('Updated Successfully!');
      mediaForm.markAsPristine();
      this.apiInProgress.mediaForm = false;
    } catch (error) {
      this.toastr.error('Unable to update!');
      this.apiInProgress.mediaForm = false;
    }
  }

  async uploadImage(files: FileList, inputRef: HTMLInputElement, mediaFormData: FormGroup | AbstractControl) {
    try {
      if (files?.length) {
        this.apiInProgress.image.add(mediaFormData.get('id').value);
        const formData: FormData = new FormData();
        formData.append('file', files.item(0), files.item(0)?.name || `Image.${files.item(0)?.type ? files.item(0).type.slice(files.item(0).type.lastIndexOf('/') + 1) : 'jpg'}`);
        formData.append('id', mediaFormData.get('id').value);
        const response = await this.ecardDetailsService.uploadImage(formData).toPromise() as any;
        mediaFormData.patchValue({
          image: response.image
        });
        this.apiInProgress.image.delete(mediaFormData.get('id').value);
        inputRef.value = null;
        console.log(response);
        this.toastr.success(`Image uploaded successfully!`);
      }
    } catch (error) {
      this.apiInProgress.image.delete(mediaFormData.get('id').value);
      inputRef.value = null;
      this.toastr.error(`Error uploading image!`);
      console.error(error)
    }
  }

  async deleteDocument(id, index) {
    try {
      this.apiInProgress.mediaForm = true;
      const response = await this.ecardDetailsService.deleteDocument(id).toPromise();
      this.removeMediaForm(index);
      this.toastr.success('Deleted Successfully!');
      this.apiInProgress.mediaForm = false;
    } catch (error) {
      this.toastr.error('Unable to delete!');
      this.apiInProgress.mediaForm = false;
    }
  }
}
