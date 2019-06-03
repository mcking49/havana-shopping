import { TeamService } from './../../services/team.service';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ShoppingItemService } from 'src/app/services/shopping-item.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.page.html',
  styleUrls: ['./shopping.page.scss'],
})
export class ShoppingPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private shoppingItemService: ShoppingItemService,
    private teamService: TeamService
  ) { }

  ngOnInit() {
  }

  /**
   * Add an item to the shopping list.
   */
  public async addItemToShoppingList(): Promise<void> {
    const addItemAlert = await this.alertCtrl.create({
      header: 'Add an item to the shopping list',
      inputs: [
        {
          name: 'itemName',
          type: 'text',
          placeholder: 'Name of item e.g. apple'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add Item',
          handler: (data) => {
            const name: string = data.itemName;
            const teamId: string = this.teamService.currentTeam.id;
            this.shoppingItemService.addItemToShoppingList(name, teamId);
          }
        }
      ]
    });
    addItemAlert.present();
  }

}
