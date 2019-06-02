import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-shopping',
        children: [
          {
            path: '',
            loadChildren: '../tab-shopping/tab-shopping.module#TabShoppingPageModule'
          }
        ]
      },
      {
        path: 'tab-settings',
        children: [
          {
            path: '',
            loadChildren: '../tab-settings/tab-settings.module#TabSettingsPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab-shopping',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab-shopping',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
