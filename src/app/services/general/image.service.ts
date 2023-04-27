import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { IImage } from 'src/app/interfaces/image';
import { IReturnResult } from 'src/app/interfaces/returnresult';
import { environment } from 'src/environments/environment';

@Injectable()

export class ImageService { 
    private url = environment.API_URL + '/Image/';

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        public translate: TranslateService,
    ){

    }

    private _images: BehaviorSubject<Array<IImage>> = new BehaviorSubject([]);
    public images = this._images.asObservable();

    private _isUploading: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public isUploading = this._isUploading.asObservable();

    public GetByAppType(apptypeId: number, linktypeId: number) {
        this.http.get<IReturnResult>(this.url + `GetByAppType?apptypeId=${apptypeId}&linktypeId=${linktypeId}`, {
                headers: new HttpHeaders({
                "Content-Type": "application/json"
                })
            }).subscribe({
                next: (result: IReturnResult) => {
                    if(result.success) { 
                        this._images.next(result.object);
                        if(result.message.length > 0) {
                            this.toastr.warning(this.translate.instant(result.message));
                        }
                    }
                    else {
                        this._images.next([]);
                    }
                },
                error: err => {
                    this.toastr.error(this.translate.instant("err") + err);
                }
            }
        );
    }

    public uploadFile(file: File, appTypeId: number, linkTypeId: number) {
        this._isUploading.next(true);
        const formData = new FormData();
        formData.append('file', file, file.name);

        this.http.post<IReturnResult>(this.url + "Upload", formData, {
            headers: new HttpHeaders({

            })
          }).subscribe({
            next: (result: IReturnResult) => {
              if(result.success) { 
                if(result.message.length > 0) {
                    this.toastr.warning(this.translate.instant(result.message));
                }
                let oImage: IImage = <IImage>{};
                oImage.id = 0;
                oImage.linkedapptypeId = appTypeId;
                oImage.linkedtypeId = linkTypeId;
                oImage.extension = file.name.split('.').pop();
                oImage.filename = file.name;
                oImage.imagelink = result.object.Image;
                oImage.thumblink = result.object.Thumbnail;
                oImage.sort = this._images.value.length;
                this.saveImage(oImage);
                this._isUploading.next(false);
              }
              else {
                this.toastr.warning(this.translate.instant(result.message));
                this._isUploading.next(false);
              }
            },
            error: err => {
              this.toastr.error(this.translate.instant("err") + err);
              this._isUploading.next(false);
            }
          });
    }
    
    public async updateList(images: Array<IImage>) {
        this.http.post<IReturnResult>(this.url + "UpdateList", images, {
            headers: new HttpHeaders({
              "Content-Type": "application/json"
            })
          }).subscribe({
            next: (result: IReturnResult) => {
              if(result.success) {
                let oImages = <Array<IImage>>result.object;
                this._images.next(oImages);
                if(result.message.length > 0) {
                    this.toastr.warning(this.translate.instant(result.message));
                }
              }
              else {
                this.toastr.warning(this.translate.instant(result.message));
              }
            },
            error: err => {
              this.toastr.error(this.translate.instant("err") + err);
            }
          });
    }

    public async saveImage(image: IImage) {
        this.http.post<IReturnResult>(this.url, image, {
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) {
              let oImage = <IImage>result.object;
              let oImages = this._images.value;
              if(image.id == 0) {
                oImages.push(oImage);
              } else {
                let i = oImages.findIndex(i => i.id == oImage.id)
                oImages[i] = oImage;
              }
              this._images.next(oImages);
              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
            }
            else {
              this.toastr.warning(this.translate.instant(result.message));
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
          }
        });
      }

      public async deleteImage(image: IImage) {
        this.http.delete<IReturnResult>(this.url,{
          headers: new HttpHeaders({
            "Content-Type": "application/json"
          }),
          body: image
        }).subscribe({
          next: (result: IReturnResult) => {
            if(result.success) {
              let oImage = <IImage>result.object;
              let oImages = this._images.value;
              let i = oImages.findIndex(i => i.id == oImage.id)
              oImages.splice(i, 1);
              this._images.next(oImages);
              if(result.message.length > 0) {
                  this.toastr.warning(this.translate.instant(result.message));
              }
            }
            else {
              this.toastr.warning(this.translate.instant(result.message));
            }
          },
          error: err => {
            this.toastr.error(this.translate.instant("err") + err);
          }
        });
      }
}