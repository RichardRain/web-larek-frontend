import {IView, IViewActions, View} from './common/View';
import { ensureElement } from "../utils/utils";
import { IEvents } from './base/events';

export interface IBasketView extends IView<IBasketView>{
  total: number;
  list: HTMLElement|HTMLElement[];
  toggleButton(value: boolean): void
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