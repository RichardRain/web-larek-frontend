import {IView, IViewActions, View} from './common/View';
import { ensureElement } from "../utils/utils";
import { IEvents } from './base/events';

export interface IBasketView extends IView<IBasketView>{
  total: number;
  list: HTMLElement|HTMLElement[];
  toggleButton(value: boolean): void
}

export interface IBasketItemView {
  id: string;
  title: string;
  index: number;
  price: number|null;
  setButtonAction(actions: IViewActions): void;
  getItem(): HTMLElement
}

export class BasketView extends View<IBasketView> {
  private _total: HTMLElement;
  private _list: HTMLElement;
  private _button: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, protected events: IEvents, actions?: IViewActions) {
    super(container);
    this._button = ensureElement<HTMLButtonElement>(`.${this.blockName}__button`, container);
    this._list = ensureElement<HTMLElement>(`.${this.blockName}__list`, container);
    this._total = ensureElement<HTMLElement>(`.${this.blockName}__price`, container);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set total(value: number) {
    this.setText(this._total, `${value} синапсов`);
  }

  set list(items: HTMLElement[] | null) {
    if (items) {
      this._list.replaceChildren(...items);
    }
  }

  get list(): HTMLElement {
    return this._list;
  }

  toggleButton(value: boolean): void {
    this._button.toggleAttribute('Disabled', value);
  }
}

export class BasketItemView extends View<IBasketItemView> {
  private _button: HTMLButtonElement;
  private _title: HTMLElement;
  private _price: HTMLElement;
  private _index: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || '';
  }

  set index(value: number) {
    this.setText(this._index, String(value));
  }

  set price(value: number | null) {
    if (this._price) {
      if (value === null) {
        this.setText(this._price, 'Бесценно');
      } else {
        const itemPrice: string = `${value} синапсов`;
        this.setText(this._price, itemPrice);
      }
    }
  }

  setButtonAction(actions: IViewActions) {
    this._button.addEventListener('click', actions.onClick);
  }

  getItem(): HTMLElement {
    return this.container;
  }
}