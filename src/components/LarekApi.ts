import { Api, ApiListResponse } from './base/api';
import { IItem, IOrder, IOrderFinished, TServerResponse } from '../types/index'

export interface ILarekApi {
  getItemList: () => Promise<IItem[]>;
  getItem: (id: string) => Promise<IItem>;
  makeOrder(order: IOrderFinished): Promise<TServerResponse>;
}

export class LarekApi extends Api implements ILarekApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getItemList(): Promise<IItem[]> {
    return this.get('/product/').then((data: ApiListResponse<IItem>) =>
      data.items.map((item: IItem) => ({
        ...item,
        image: this.cdn + item.image
      }))
    )
  }

  getItem(id: string): Promise<IItem> {
    return this.get(`/product/${id}`).then((item: IItem) => ({
      ...item,
      image: this.cdn + item.image
    }))
  }

  makeOrder(order: IOrderFinished): Promise<TServerResponse> {
    return this.post('/order', order);
  }
}