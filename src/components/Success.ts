import {IViewActions, View} from './common/View';
import { ensureElement } from "../utils/utils";
import { TSuccessDescription } from '../types/index';

export interface ISuccessView extends View<ISuccessView> {
  description: TSuccessDescription;
}

export class SuccessView extends View<ISuccessView> {
  private _description: HTMLElement;
  private _button: HTMLButtonElement;

  constructor(blockName: string, container: HTMLElement, actions?: IViewActions) {
    super(container);
    this._description = ensureElement<HTMLElement>(`.${blockName}__description`, container);
    this._button = ensureElement<HTMLButtonElement>(`.${blockName}__close`, container);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set description(data: TSuccessDescription) {
    if (data.payment === 'card') {
      this.setText(this._description, `Списано ${data.total} синапсов`);
    } else {
      this.setText(this._description, `К оплате при получении ${data.total} синапсов`);
    }
  }
}