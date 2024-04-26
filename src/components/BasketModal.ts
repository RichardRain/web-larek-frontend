import { Modal, IModalAction } from './Modal';
import {View} from './common/View';
import { ensureElement } from "../utils/utils";
import { IBasketView, IBasketItemView } from '../types/index';
import { IEvents } from './base/events';

export class BasketModal extends Modal implements IBasketView {
  _total: HTMLElement;
  _list: HTMLElement;
  _button: HTMLButtonElement;
  _content: HTMLElement;
  items: HTMLElement[];
  isOpen: boolean;

  constructor(protected blockName: string, container: HTMLElement, protected events: IEvents, content: HTMLElement) {
    super(blockName, container, events);
    this._content.replaceChildren(content);
    this._button = ensureElement<HTMLButtonElement>(`.${this.blockName}__button`, this._content);
    this._list = ensureElement<HTMLElement>(`.${this.blockName}__list`, this._content);
    this._total = ensureElement<HTMLElement>(`.${this.blockName}__price`, this._content);
  }

  set contnet(value: HTMLElement | null) {
    if (value) {
      this._content.replaceChildren(value);
      this._button = ensureElement<HTMLButtonElement>(`.${this.blockName}__button`, this._content);
      this._list = ensureElement<HTMLElement>(`.${this.blockName}__list`, this._content);
      this._total = ensureElement<HTMLElement>(`.${this.blockName}__price`, this._content);
    }
  }

  set total(value: number) {
    this.setText(this._total, `${value} синапсов`);
    this.setText(this._content.querySelector(`.${this.blockName}__price`), `${value} синапсов`);
  }

  set list(items: HTMLElement[] | null) {
    if (items) {
      this._list.replaceChildren(...items);
      this._content.querySelector(`.${this.blockName}__list`).replaceChildren(this._list);
    }
  }

  get list(): HTMLElement {
    return this._list;
  }

  setButtonAction(actions: IModalAction) {
    this._button.addEventListener('click', actions.onClick);
  }
}

interface IBasketActions {
  onClick: (event: MouseEvent) => void;
}

export class BasketItem extends View<IBasketItemView> implements IBasketItemView {
  _button: HTMLButtonElement;
  _title: HTMLElement;
  _price: HTMLElement;
  _index: HTMLElement;
  _content: HTMLElement;

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

  setButtonAction(actions: IModalAction) {
    this._button.addEventListener('click', actions.onClick);
  }

  getItem(): HTMLElement {
    return this.container;
  }
}