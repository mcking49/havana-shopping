import { ShoppingItem } from './../interfaces/shopping-item';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
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

  public deleteItem(item: ShoppingItem, teamId: string): Promise<void> {
    const itemPath = `${this.getShoppingListPath(teamId)}/${item.id}`;
    return this.firestore.doc<ShoppingItem>(itemPath).delete();
  }

  public getItemsToBuyList(teamId: string): AngularFirestoreCollection<ShoppingItem> {
    return this.firestore.collection<ShoppingItem>(this.getShoppingListPath(teamId),
      ref => ref.where('picked', '==', false)
    );
  }

  public getItemsPickedUpList(teamId: string): AngularFirestoreCollection<ShoppingItem> {
    return this.firestore.collection<ShoppingItem>(this.getShoppingListPath(teamId),
      ref => ref.where('picked', '==', true)
    );
  }

  public pickItem(item: ShoppingItem, teamId: string): Promise<void> {
    const itemPath = `${this.getShoppingListPath(teamId)}/${item.id}`;
    return this.firestore.doc<ShoppingItem>(itemPath).update({picked: true});

    // Below is unused code that does the same thing, but uses firebase transactons instead of direct updates.
    // const itemRef: firebase.firestore.DocumentReference = this.firestore.doc<ShoppingItem>(itemPath).ref;

    // return this.firestore.firestore.runTransaction(async (transaction: firebase.firestore.Transaction) => {
    //   transaction.update(itemRef, {picked: true});
    // });
  }

  public unPickItem(item: ShoppingItem, teamId: string): Promise<void> {
    const itemPath = `${this.getShoppingListPath(teamId)}/${item.id}`;
    return this.firestore.doc<ShoppingItem>(itemPath).update({picked: false});
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
