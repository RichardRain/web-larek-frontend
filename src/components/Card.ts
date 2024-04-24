import { View } from './View'
import {ICard } from '../types/index'
import {ensureElement} from "../utils/utils";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card<T> extends View<ICard<T>> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _category?: HTMLElement;
  protected _price?: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
    // this._description = ensureElement<HTMLElement>(`.${blockName}__description`, container);
    this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    // this._button = ensureElement<HTMLButtonElement>(`.${blockName}__button`, container);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
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

  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this.title);
    }
  }

  set category(value: string) {
    if (this._category) {
      this.setText(this._category, value);
    }
  }

  set price(value: number|null) {
    if (this._price) {
      if (value === null) {
        this.setText(this._price, 'Бесценно');
      } else {
        const itemPrice: string = `${value} синапсов`;
        this.setText(this._price, itemPrice);
      }
    }
  }

  set description(value: string | string[]) {
    if (this._description) {
      if (Array.isArray(value)) {
        this._description.replaceWith(...value.map(str => {
          const descTemplate = this._description!.cloneNode() as HTMLElement;
          this.setText(descTemplate, str);
          return descTemplate;
        }));
      } else {
        this.setText(this._description, value);
      }
    }
  }
}