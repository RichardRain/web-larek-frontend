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
}

export interface IOrderFinished {
  payment: TPayment | undefined;
  email: string;
  phone: string;
  address: string;
  total: number | null;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number | null;
}

export interface IErrorResponse {
  error: string;
}

export type TServerResponse = Partial<IOrderResult> & Partial<IErrorResponse>;

export type TPayment = 'card' | 'cash';

export type TSuccessDescription = {payment: TPayment, total: number};

export type TOptions = Record<string, TOption>;

type TOption = Record<string,  string|RegExp>;