import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ShoppingItem } from '../interfaces/shopping-item';
import { ShoppingItemService } from './shopping-item.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(
    private firestore: AngularFirestore,
    private shoppingItemService: ShoppingItemService
  ) { }

  /**
   * Add an item from the inventory into the shopping list.
   * Deletes the item from the inventory at the same time.
   * @param item - The item to be added to the shopping list.
   * @returns - Resolves when the operations have completed.
   */
  public addToShoppingList(item: ShoppingItem): Promise<void[]> {
    const itemPath = `${this.path(item.teamId)}/${item.id}`;
    const addToShoppingList: Promise<void> = this.shoppingItemService.addItemToShoppingList(item.name, item.teamId);
    const deleteFromInventory: Promise<void> = this.firestore.doc<ShoppingItem>(itemPath).delete();
    return Promise.all([addToShoppingList, deleteFromInventory]);
  }

  /**
   * Get the team's inventory.
   * @param teamId - The ID of the team the inventory belongs to.
   * @returns - A Collection of items in the inventory.
   */
  public getInventory(teamId: string): AngularFirestoreCollection<ShoppingItem> {
    return this.firestore.collection<ShoppingItem>(this.path(teamId));
  }

  /**
   * Get the path to the inventory.
   * @param teamId - The ID of the team the inventory belongs to.
   * @returns - The inventory path.
   */
  private path(teamId: string): string {
    return `team/${teamId}/inventory`;
  }
}
