import { Model } from './common/Model'
import { IItem, IOrder, TPayment, ICatalog, IOrderFinished, TOptions } from '../types/index';
import { IEvents } from './base/events';

export type CatalogChangeEvent = {
  catalog: CatalogModel;
}

export interface ICatalogModel extends ICatalog {
  addItem(item: IItem): void;
  setItems(items: IItem[]): void;
  getItem(id: string): IItem;
  deleteItem(id: string): void;
}

export interface IBasketModel extends IOrder {
  validate(data: Partial<IOrder>): boolean;
  addItem(item: IItem): void;
  getItem(id: string): IItem;
  removeItem(index: number): void;
  getTotal(): number;
  clearOrder(): void;
  getOrder(): IOrderFinished;
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
  emailRe: RegExp;
  phoneRe: RegExp;

  constructor(data: IItem[], events: IEvents, options: TOptions) {
    super(data, events);
    this.emailRe = options.regex.email as RegExp;
    this.phoneRe = options.regex.phone as RegExp;
  }

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
    this.emitChanges('basket:changed', { items: this.items });
  }

  validate(data: Partial<IOrder>): boolean {
    if (data.email) {
      return this.emailRe.test(data.email);
    }
    if (data.phone) {
      if (data.phone.length > 16) {
        return false;
      } else {
        return this.phoneRe.test(data.phone);
      }
      
    }
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

  getOrder(): IOrderFinished {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items.map((item) => {
        return item.id;
      }),
    };
  }
}