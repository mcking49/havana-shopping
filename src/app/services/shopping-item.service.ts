import { ShoppingItem } from './../interfaces/shopping-item';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShoppingItemService {

  constructor(private firestore: AngularFirestore) { }

  /**
   * Add an item to the shopping list.
   * @param name - The name of the shopping item.
   * @param teamId - The ID of the team the shopping item belongs to.
   * @returns - Resolves when the item has been added to the shopping list.
   */
  public addItemToShoppingList(name: string, teamId: string): Promise<void> {
    const shoppingItem: ShoppingItem = {
      id: this.firestore.createId(),
      name,
      picked: false,
      teamId
    };
    const itemPath = `${this.getShoppingListPath(teamId)}/${shoppingItem.id}`;

    return this.firestore.doc<ShoppingItem>(itemPath).set(shoppingItem);
  }

  /**
   * Get the shopping list path for the team.
   * @param teamId - The ID of the team the shopping list belongs to.
   * @returns - The shopping list path.
   */
  private getShoppingListPath(teamId: string): string {
    return `team/${teamId}/shoppingList`;
  }
}
