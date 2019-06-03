import { TeamService } from './../../services/team.service';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ShoppingItemService } from 'src/app/services/shopping-item.service';
import { Observable } from 'rxjs';
import { ShoppingItem } from 'src/app/interfaces/shopping-item';
import { Team } from 'src/app/interfaces/team';
import * as _ from 'lodash';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.page.html',
  styleUrls: ['./shopping.page.scss'],
})
export class ShoppingPage implements OnInit {

  public currentTeam: Team;
  public itemsToBuy$: Observable<ShoppingItem[]>;
  public itemsPickedUp$: Observable<ShoppingItem[]>;

  constructor(
    private alertCtrl: AlertController,
    private shoppingItemService: ShoppingItemService,
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.teamService.getCurrentTeam().then((team: Team) => {
      this.currentTeam = team;
      this.itemsToBuy$ = this.shoppingItemService
        .getItemsToBuyList(this.currentTeam.id)
        .valueChanges();

      this.itemsPickedUp$ = this.shoppingItemService
        .getItemsPickedUpList(this.currentTeam.id)
        .valueChanges();
    });
  }

  public get teamId(): string {
    return _.get(this.currentTeam, 'id', '');
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

  public pickItem(item: ShoppingItem): Promise<void> {
    return this.shoppingItemService.pickItem(item, this.teamId);
  }

  public deleteItem(item: ShoppingItem): Promise<void> {
    return this.shoppingItemService.deleteItem(item, this.teamId);
  }

  public unPickItem(item: ShoppingItem): Promise<void> {
    return this.shoppingItemService.unPickItem(item, this.teamId);
  }

}
