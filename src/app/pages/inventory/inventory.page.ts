import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { Observable } from 'rxjs';
import { ShoppingItem } from 'src/app/interfaces/shopping-item';
import { Team } from 'src/app/interfaces/team';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  public inventory$: Observable<ShoppingItem[]>;
  public currentTeam: Team;

  constructor(
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

}
