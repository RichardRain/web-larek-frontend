import { IViewActions, View } from './common/View';
import { ensureElement } from "../utils/utils";

interface ICard<T> {
  id: string;
  title: string;
  image?: string;
  description?: string;
  category?: string;
  price?: number | null;
}

export class Card<T> extends View<ICard<T>> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _category?: HTMLElement;
  protected _price?: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: IViewActions) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
    this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

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
      switch (value) {
        case 'софт-скил':
          this._category.classList.add(`${this.blockName}__category_soft`);
          break;
        case 'хард-скил':
          this._category.classList.add(`${this.blockName}__category_hard`);
          break;
        case 'другое':
          this._category.classList.add(`${this.blockName}__category_other`);
          break;
        case 'дополнительное':
          this._category.classList.add(`${this.blockName}__category_additional`);
          break;
        case 'кнопка':
          this._category.classList.add(`${this.blockName}__category_button`);
          break;
        default:
          this._category.classList.add(`${this.blockName}__category_other`);
          break;
      }
    }
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