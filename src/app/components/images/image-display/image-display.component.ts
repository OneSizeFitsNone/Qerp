import { ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { IImage } from 'src/app/interfaces/image';
import { ImageService } from 'src/app/services/general/image.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'az-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.scss'],
  providers: [ImageService]
})

export class ImageDisplayComponent {
  
  @Input() appTypeId: number;
  @Input() linkTypeId: number;
  @Input() editEnabled: boolean = true;

  public images: Array<IImage> = [];
  public location: string = environment.IMAGE_URL;
  public showEdit = false;

  public imgWidth: number = 0;

  constructor(
    private imageService: ImageService,
    private ref: ChangeDetectorRef
  ) { 
    this.imageService.images.subscribe(i => this.images = i);
  }

  ngOnInit() {
      
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["appTypeId"] || changes["linkTypeId"]) {
      if(this.appTypeId && this.linkTypeId) {
        this.imageService.GetByAppType(this.appTypeId, this.linkTypeId);
      }
    }
  }

  public onCloseEdit(value: any) {
    this.imageService.GetByAppType(this.appTypeId, this.linkTypeId);
    this.showEdit = value;
  }

}
