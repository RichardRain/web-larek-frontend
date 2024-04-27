import { IView, View } from './common/View';
import { ensureElement } from "../utils/utils";
import { IEvents } from './base/events';
import { TOptions } from '../types';

export interface IModal extends IView<IModal> {
  content: HTMLElement | null;
  _button?: HTMLButtonElement;
  open(): void;
  close(): void;
}

interface IModalData {
  content: HTMLElement;
}

export interface IModalAction {
  onClick: (event: MouseEvent) => void;
}

export class Modal extends View<IModal> implements IModal {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected options: TOptions;

  constructor(protected blockName: string, container: HTMLElement, protected events: IEvents, options: TOptions) {
    super(container);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);
    
    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', (event) => event.stopPropagation());
    this.options = options;
  }

  set content(value: HTMLElement | null) {
    if (value) {
      this._content.replaceChildren(value);
    }
  }

  open(): void {
    this.toggleClass(this.container, 'modal_active', true);
    this.events.emit(this.options.events['MODAL_OPEN'] as string);
  }

  close(): void {
    this.toggleClass(this.container, 'modal_active', false);
    this.content = null;
    this.events.emit(this.options.events['MODAL_CLOSE'] as string);
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}