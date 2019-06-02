import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabShoppingPage } from './tab-shopping.page';

describe('Tab1Page', () => {
  let component: TabShoppingPage;
  let fixture: ComponentFixture<TabShoppingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabShoppingPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabShoppingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
