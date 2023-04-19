import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { IImage } from 'src/app/interfaces/image';
import { ImageService } from 'src/app/services/general/image.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'az-image-edit',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.scss'],
  providers: [ImageService],
  viewProviders: [DragulaService]
})

export class ImageEditComponent {
  @Input() appTypeId: number;
  @Input() linkTypeId: number;
  @Output() showEdit = new EventEmitter<boolean>(false);

  public file:any;
  
  public images: Array<IImage> = [];
  public location: string = environment.IMAGE_URL;
  public isUploading;
  sub = new Subscription

  constructor(
    private dragula: DragulaService,
    private imageService: ImageService,
    private ref: ChangeDetectorRef
  ) { 


  }

  ngOnInit() {
    this.imageService.images.subscribe(i => {
      this.images = i;
      this.ref.detectChanges();
    });
    this.imageService.isUploading.subscribe(iu => {
      this.isUploading = iu;
      this.ref.detectChanges();
    });

    this.sub = this.dragula
    .drop("bag")
    .subscribe(value => {
      for(let image of this.images) {
        image.sort = this.images.indexOf(image);
      }
      this.imageService.updateList(this.images);
    });

  }

  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes["appTypeId"] || changes["linkTypeId"]) {
      if(this.appTypeId && this.linkTypeId) {
        this.imageService.GetByAppType(this.appTypeId, this.linkTypeId);
      }
    }
  }
  
  public fileChange(input){
    if (input.files.length) {   
      let fileToUpload = <File>input.files[0];    
      this.imageService.uploadFile(fileToUpload, this.appTypeId, this.linkTypeId);
    }
  }

  public removeFile(){
    this.file = '';
  }
  
  public close() {
    this.showEdit.emit(false);
  }

  public saveImage(oImage: IImage) {
    this.imageService.saveImage(oImage);
  }

  public deleteImage(oImage: IImage) {
    this.imageService.deleteImage(oImage);
  }



}
