import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailPage } from './detail.page';
import { CommentsModalPage } from './comments/comments.page';
import { ImageModalPage } from '../image-modal/image-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailPage, CommentsModalPage, ImageModalPage],
    entryComponents: [CommentsModalPage],
})
export class DetailPageModule {}
