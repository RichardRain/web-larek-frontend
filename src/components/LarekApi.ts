import {Api, ApiListResponse} from './base/api';
import {IItem} from '../types/index'

export interface ILarekApi {
  getItemList: () => Promise<IItem[]>;
  getItem: (id: string) => Promise<IItem>;
  // makeOrder(id: string, bid: IBid): Promise<LotUpdate>;
  // orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // getItemList():  {
  getItemList(): Promise<IItem[]> {
    return this.get('/product/').then((data: ApiListResponse<IItem>) => 
      data.items.map((item: IItem) => ({
        ...item,
        image: this.cdn + item.image
      }))
    )}

  getItem(id: string): Promise<IItem> {
    return this.get(`/product/${id}`).then((item: IItem) => ({
      ...item,
      image: this.cdn + item.image
    }))
  }
}