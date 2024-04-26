import { Modal, IModalAction } from './Modal';
import { ensureElement } from "../utils/utils";
import { IItemModal } from '../types/index';

export class ItemModal extends Modal implements IItemModal {
  _title: HTMLElement;
  _description: HTMLElement;
  _image: HTMLImageElement;
  _category: HTMLElement;
  _price: HTMLElement;
  _button: HTMLButtonElement;
  _content: HTMLElement;

  set content(value: HTMLElement | null) {
    if (value) {
      this._content.replaceChildren(value);
      this._button = ensureElement<HTMLButtonElement>(`.${this.blockName}__button`, this._content);
      this._title = ensureElement<HTMLElement>(`.${this.blockName}__title`, this._content);
      this._description = ensureElement<HTMLElement>(`.${this.blockName}__text`, this._content);
      this._image = ensureElement<HTMLImageElement>(`.${this.blockName}__image`, this._content);
      this._category = ensureElement<HTMLElement>(`.${this.blockName}__category`, this._content);
      this._price = ensureElement<HTMLElement>(`.${this.blockName}__price`, this._content);
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
        this._button.setAttribute('Disabled', 'true');
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

  setButtonAction(actions: IModalAction) {
    this._button.addEventListener('click', actions.onClick);
  }
}