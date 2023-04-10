import { Component, Input, SimpleChanges } from '@angular/core';
import { IImage } from 'src/app/interfaces/image';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'az-image-thumbnail',
  templateUrl: './image-thumbnail.component.html',
  styleUrls: ['./image-thumbnail.component.scss']
})

export class ImageThumbnailComponent {
  @Input() images: Array<IImage> = [];

  public image: IImage;
  public location: string = environment.IMAGE_URL;
  
  constructor(

  ) { 

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["images"] && this.images) {
        this.image = this.images[0]
    }
  }
  
}
