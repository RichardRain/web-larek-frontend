import {IView, IViewActions, View} from './common/View';
import { ensureAllElements, ensureElement } from "../utils/utils";
import { IEvents } from './base/events';

export interface IForm extends IView<IForm> {
  error: string;
  selectPayment(name: string): void;
  toggleButton(value: boolean): void;
}

export class Form extends View<IForm> {
  private _form: HTMLFormElement;
  private _inputs: HTMLInputElement[];
  private _error: HTMLElement;
  private _button: HTMLButtonElement;
  private _payment?: HTMLButtonElement[] | null;

  constructor(protected blockName: string, container: HTMLElement, protected events: IEvents, actions?: IViewActions) {
    super(container);
    this._form = container.querySelector('.form');
    this._inputs = ensureAllElements<HTMLInputElement>(`.${this.blockName}__input`, container);
    this._error = ensureElement<HTMLElement>(`.${this.blockName}__errors`, container);
    this._button = container.querySelector(`.order__button`);
    if (!this._button) {
      this._button = container.querySelector('.button');
    }
    this._payment = ensureAllElements<HTMLButtonElement>(`.button_alt`, container);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }

    if (this._payment) {
      this._payment.forEach((button) => {
        button.addEventListener('click', () => {
          events.emit('form:changed', {payment: button.name});
        });
      })
    }

    if(this._inputs) {
      this._inputs.forEach((input) => {
        input.addEventListener('input', () => {
          events.emit('form:changed', {[`${input.name}`]: input.value});
        })
      })
    }
  }

  set error(value: string) {
    this.setText(this._error, value);
  }

  selectPayment(name: string): void {
    if (this._payment) {
      this._payment.forEach((button) => {
        if (button.name === name) {
          this.toggleClass(this.container.querySelector(`[name="${name}"]`), 'button_alt-active', true);
          button.toggleAttribute('Disabled', true);
        } else {
          this.toggleClass(this.container.querySelector(`[name="${button.name}"]`), 'button_alt-active', false);
          button.toggleAttribute('Disabled', false);
        }
      })
    }
  }

  toggleButton(value: boolean): void {
    this._button.toggleAttribute('Disabled', value);
  }
}