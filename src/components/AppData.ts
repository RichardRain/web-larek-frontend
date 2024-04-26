import { Model } from './common/Model'
import { ICatalogModel, IItem, IBasketModel, IOrder, TPayment, TOrderedItems } from '../types/index';

export type CatalogChangeEvent = {
  catalog: CatalogModel;
}

export class CatalogModel extends Model<IItem[]> implements ICatalogModel {
  items: IItem[] = [];
  total: number;

  addItem(item: IItem): void {
    this.items.push(item);
    this.emitChanges('catalog:changed', { items: this.items });
  }

  setItems(items: IItem[]): void {
    this.items = items;
    this.emitChanges('catalog:changed', { items: this.items });
  }

  getItem(id: string): IItem {
    return this.items.find(item => item.id === id) as IItem;
  }

  deleteItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.emitChanges('catalog:changed', { items: this.items });
  }
}

export type BasketChangeEvent = {
  basket: BasketModel;
}

export class BasketModel extends Model<IItem[]> implements IBasketModel {
  payment: TPayment | undefined;
  email: string;
  phone: string;
  address: string;
  total: number | null;
  items: IItem[] = [];
  ordered: TOrderedItems;

  addItem(item: IItem): void {
    this.items.push(item);
    this.emitChanges('basket:changed', { items: this.items });
  }

  getItem(id: string): IItem {
    return this.items.find(item => item.id === id) as IItem;
  }

  removeItem(index: number): void {
    this.items = this.items.filter((item, itemIndex) => {
      if (itemIndex !== index) {
        return item;
      }
    });
    console.log(this.items);
    this.emitChanges('basket:changed', { items: this.items });
  }

  validate(data: Record<'payment' | 'address', string> | Record<'email' | 'phone', string>): boolean {
    return true; // 
  }

  getTotal():number {
    this.total = 0;
    this.items.forEach((item) => {
      if (item.price) {
        this.total += item.price;
      }
    })
    return this.total;
  }

  clearOrder(): void {
    this.items = [];
    this.emitChanges('basket:changed', { items: this.items });
  }

  getOrder(): IOrder {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
      ordered: this.ordered,
    };
  }
}