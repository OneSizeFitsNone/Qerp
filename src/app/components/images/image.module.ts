import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ImageEditComponent } from './image-edit/image-edit.component';
import { ImageDisplayComponent } from './image-display/image-display.component';
import { DragulaModule } from 'ng2-dragula';
import { ImageThumbnailComponent } from './image-thumbnail/image-thumbnail.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DragulaModule.forRoot(), 
  ],
    declarations: [
        ImageEditComponent,
        ImageDisplayComponent,
        ImageThumbnailComponent
    ],
    exports: [ 
        ImageEditComponent,
        ImageDisplayComponent,
        ImageThumbnailComponent
    ]
})

export class ImageModule { }