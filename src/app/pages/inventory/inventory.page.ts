import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { Observable } from 'rxjs';
import { ShoppingItem } from 'src/app/interfaces/shopping-item';
import { Team } from 'src/app/interfaces/team';
import { TeamService } from 'src/app/services/team.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  public inventory$: Observable<ShoppingItem[]>;
  public currentTeam: Team;

  constructor(
    private alertCtrl: AlertController,
    private inventoryService: InventoryService,
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.teamService.getCurrentTeam().then((team: Team) => {
      this.currentTeam = team;
      this.inventory$ = this.inventoryService
        .getInventory(this.currentTeam.id)
        .valueChanges();
    });
  }

  /**
   * Add an item from the inventory into the shopping list.
   * @param item - The item that needs to be added to the shopping list.
   * @returns - resolves when the operation completes.
   */
  public async addToShoppingList(item: ShoppingItem): Promise<void[]> {
    return this.inventoryService.addToShoppingList(item);
  }

  /**
   * Delete an item from the inventory.
   * @param item - The item to be deleted.
   */
  public async deleteItem(item: ShoppingItem): Promise<void> {
    const confirm = await this.alertCtrl.create({
      header: 'Are you sure you want to permanently delete this item from your inventory?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            return this.inventoryService.deleteItem(item, this.currentTeam.id);
          }
        }
      ]
    });
    confirm.present();
  }

}
