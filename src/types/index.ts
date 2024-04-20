export interface IItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface ICatalog {
  total: number;
  items: IItem[];
}

export interface IOrder {
  payment: TPayment | undefined;
  email: string;
  phone: string;
  address: string;
  total: number | null;
  items: IItem[];
  ordered: TOrderedItems;
}

export interface IOrderResult {
  id: string;
  total: number | null;
}

export interface IErrorResponse {
  error: string;
}

export type TPayment = 'online' | 'offline';

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>;

export type TContactInfo = Pick<IOrder, 'email' | 'phone'>;

export type TOrderedItems = Pick<IItem, 'id'>[];

export type TBasketItem = Pick<IItem, 'id' | 'title' | 'price'>;

export interface ICatalogModel extends ICatalog {
  addItem(item: IItem): void;
  getItem(id: string): IItem;
  deleteItem(id: string): void;
}

export interface IOrderModel extends IOrder {
  validate(data: Record<keyof TOrderInfo, string>|Record<keyof TContactInfo, string>): boolean;
  addItem(item: IItem): void;
  getItem(id: string): IItem;
  removeItem(id: string): void;
  clearOrder(): void;
  getOrder(): IOrder;
}

export interface IView {
  element: HTMLElement;
  render(): void;
}

export interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export interface IItemView {
  
}

export interface ICatalogView {
  content: HTMLElement[];
}

export interface IBasketItemView {
  counter?: number;
}

export interface IBasketView {
  content: HTMLElement[];
}

export interface IModal {
  modal: HTMLElement;
  button?: HTMLButtonElement;
  open(): void;
  close(): void;
  onClick(fn: Function): void;
}

export interface IItemModal {

}

export interface IFormModal {
  form: HTMLFormElement;
  inputs: HTMLInputElement[];
  errors: HTMLElement[];
  submitButton: HTMLButtonElement;
  setValid(isValid: boolean): void;
  setError(data: string): void;
  showError(errorElement: HTMLElement): void;
  hideError(errorElement: HTMLElement): void;
  getInputValues(): Record<string, string>;
  onSubmit(fn: Function): void;
}

export interface ISuccessModal {

}

export interface IPresenter {

}