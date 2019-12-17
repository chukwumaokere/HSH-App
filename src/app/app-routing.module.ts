import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'property-images', loadChildren: './property-images/property-images.module#PropertyImagesPageModule' },
  { path: 'gallery/:id/:room', loadChildren: './gallery/gallery.module#GalleryPageModule' },
  { path: 'services', loadChildren: './services/services.module#ServicesPageModule' },
  { path: 'ratings', loadChildren: './ratings/ratings.module#RatingsPageModule' },
  { path: 'services/detail/:serviceid', loadChildren: './services/detail/detail.module#DetailPageModule' },
  { path: 'notifications', loadChildren: './tabs/notifications/notifications.module#NotificationsPageModule' },
  { path: 'tabs/dashboard', loadChildren: './tabs/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'tabs/completed', loadChildren: './tabs/completed/completed.module#CompletedPageModule' }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
