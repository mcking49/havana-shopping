import { TestBed } from '@angular/core/testing';

import { ShoppingItemService } from './shopping-item.service';

describe('ShoppingItemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShoppingItemService = TestBed.get(ShoppingItemService);
    expect(service).toBeTruthy();
  });
});
