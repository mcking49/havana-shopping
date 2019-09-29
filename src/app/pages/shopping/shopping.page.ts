import { TeamService } from './../../services/team.service';
import { AlertController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingItemService } from 'src/app/services/shopping-item.service';
import { Observable, Subscription } from 'rxjs';
import { ShoppingItem } from 'src/app/interfaces/shopping-item';
import { InventoryService } from 'src/app/services/inventory.service';
import { Team } from 'src/app/interfaces/team';
import * as _ from 'lodash';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.page.html',
  styleUrls: ['./shopping.page.scss'],
})
export class ShoppingPage implements OnInit, OnDestroy {

  public currentTeam: Team;
  public itemsToBuy$: Observable<ShoppingItem[]>;
  public itemsPickedUpSubscription: Subscription;
  public itemsPickedUp: ShoppingItem[] = [];

  constructor(
    private alertCtrl: AlertController,
    private inventoryService: InventoryService,
    private shoppingItemService: ShoppingItemService,
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.teamService.getCurrentTeam().then((team: Team) => {
      this.currentTeam = team;
      this.itemsToBuy$ = this.shoppingItemService
        .getItemsToBuyList(this.currentTeam.id)
        .valueChanges();

      this.itemsPickedUpSubscription = this.shoppingItemService
        .getItemsPickedUpList(this.currentTeam.id)
        .valueChanges()
        .subscribe((itemsPickedUp: ShoppingItem[]) => {
          this.itemsPickedUp = itemsPickedUp;
        });
    });
  }

  ngOnDestroy() {
    this.itemsPickedUpSubscription.unsubscribe();
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

  public async finishShopping(): Promise<void> {
    const confirm = await this.alertCtrl.create({
      header: 'Are you sure you have finished shopping?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.inventoryService.movePickedToInventory(this.teamId);
          }
        }
      ]
    });
    confirm.present();
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
