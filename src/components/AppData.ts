import { Model } from './common/Model'
import { ICatalogModel, IItem } from '../types/index';

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