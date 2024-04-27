import { ILarekApi } from './LarekApi';
import { IEvents } from './base/events';
import { IErrorResponse, IItem, IOrder, IOrderResult, TOptions } from '../types/index';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { IBasketModel, BasketModel, ICatalogModel, CatalogModel, CatalogChangeEvent, BasketChangeEvent } from './AppData';
import { IPage, Page } from './Page';
import { IModal, Modal } from './Modal';
import { IItemPreview, ItemPreview } from './ItemPreview';
import { BasketItemView, BasketView, IBasketView } from './Basket';
import { Form, IForm } from './Form';
import { ISuccessView, SuccessView } from './Success';
import { Card } from './Card';

interface IPresenter {
  api: ILarekApi;
  events: IEvents;
  options: TOptions;
  currentScreen: string;
  pageElement: HTMLElement;
  modalElement: HTMLDivElement;
  cardCatalogTemplate: HTMLTemplateElement;
  cardPreviewTemplate: HTMLTemplateElement;
  basketTemplate: HTMLTemplateElement;
  basketItemTemplate: HTMLTemplateElement;
  formOrderTemplate: HTMLTemplateElement;
  formContactsTemplate: HTMLTemplateElement;
  successTemplate: HTMLTemplateElement;
  catalogModel: ICatalogModel;
  basketModel: IBasketModel;
  page: IPage;
  modal: IModal;
  itemPreview: IItemPreview;
  basket: IBasketView;
  formOrder: IForm;
  formContacts: IForm;
  successView: ISuccessView;
  init(): void;
}

export class Presenter implements IPresenter {
  api: ILarekApi;
  events: IEvents;
  options: TOptions;
  currentScreen: string;
  pageElement: HTMLElement;
  modalElement: HTMLDivElement;
  cardCatalogTemplate: HTMLTemplateElement;
  cardPreviewTemplate: HTMLTemplateElement;
  basketTemplate: HTMLTemplateElement;
  basketItemTemplate: HTMLTemplateElement;
  formOrderTemplate: HTMLTemplateElement;
  formContactsTemplate: HTMLTemplateElement;
  successTemplate: HTMLTemplateElement;
  catalogModel: ICatalogModel;
  basketModel: IBasketModel;
  page: IPage;
  modal: IModal;
  itemPreview: IItemPreview;
  basket: IBasketView;
  formOrder: IForm;
  formContacts: IForm;
  successView: ISuccessView;

  constructor(api: ILarekApi, events: IEvents, options: TOptions) {
    // Элементы страницы:
    this.pageElement = document.querySelector('.page');
    this.modalElement = ensureElement<HTMLDivElement>('#modal-container');
    // Шаблоны:
    this.cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
    this.cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
    this.basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
    this.basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
    this.formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
    this.formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
    this.successTemplate = ensureElement<HTMLTemplateElement>('#success');

    // Инициализация настроек презентера
    this.api = api;
    this.events = events;
    this.options = options;

    // Инициализация компонентов:
    // Модель данных каталога товаров
    this.catalogModel = new CatalogModel([], events);
    // Модель данных корзины 
    this.basketModel = new BasketModel([], events, options);

    // Глобальные контейнеры:
    // Главная страница
    this.page = new Page(this.pageElement, events);
    // Модальное окно
    this.modal = new Modal(this.options.blocks.modal as string, this.modalElement, events, options);

    // Части интерфейса, которые подставляются в модальное окно:
    // Карточка товара
    this.itemPreview = new ItemPreview(this.options.blocks.card as string, cloneTemplate(this.cardPreviewTemplate), events, {
      onClick: () => events.emit(this.options.events['BASKET_ADD'] as string, this.catalogModel.getItem(this.itemPreview.id))
    });
    // Корзина
    this.basket = new BasketView(this.options.blocks.basket as string, cloneTemplate(this.basketTemplate), events, {
      onClick: () => events.emit(this.options.events['FORM_ORDER'] as string)
    });
    // Форма о способе оплаты
    this.formOrder = new Form(this.options.blocks.form as string, cloneTemplate(this.formOrderTemplate), events, {
      onClick: (evt) => {
        evt.preventDefault();
        events.emit(this.options.events['FORM_CONTACTS'] as string);
      }
    });
    // Форма контактных данных
    this.formContacts = new Form(this.options.blocks.form as string, cloneTemplate(this.formContactsTemplate), events, {
      onClick: (evt) => {
        evt.preventDefault();
        events.emit(this.options.events['FORM_SUBMIT'] as string);
      }
    });
    // Сообщение об успешном заказе
    this.successView = new SuccessView(this.options.screens['ORDER_SUCCESS'] as string, cloneTemplate(this.successTemplate), {
      onClick: () => this.modal.close()
    });
    // Текущее состояние экрана
    this.currentScreen = this.options.screens['MAIN_SCREEN'] as string;
  }

  // Бизнес-логика
  init(): void {
    // Получение товаров с сервера
    this.api.getItemList().then((items) => {
      items.forEach((item) => {
        this.catalogModel.addItem(item);
      });
    });

    // Рендер товаров на главном экране при изменении списка товаров
    this.events.on<CatalogChangeEvent>(this.options.events['CATALOG_CHANGED'] as string, () => {
      this.page.catalog = this.catalogModel.items.map((item) => {
        const card = new Card(this.options.blocks.card as string, cloneTemplate(this.cardCatalogTemplate), {
          onClick: () => this.events.emit(this.options.events['CARD_SELECT'] as string, item)
        });
        return card.render({
          title: item.title,
          image: item.image,
          id: item.id,
          description: item.description,
          category: item.category,
          price: item.price,
        })
      })
    });

    // Рендер списка товаров в корзине при изменении корзины
    this.events.on<BasketChangeEvent>(this.options.events['BASKET_CHANGED'] as string, () => {
      this.basket.list = this.basketModel.items.map((item, index) => {
        const basketItem = new BasketItemView(cloneTemplate(this.basketItemTemplate));
        basketItem.setButtonAction({
          onClick: () => this.events.emit(this.options.events['BASKET_REMOVE'] as string, { item: item, index: index })
        });
        return basketItem.render({
          title: item.title,
          id: item.id,
          index: index + 1,
          price: item.price,
        });
      });
      // Пересчет суммы товаров при открытой корзине
      if (this.currentScreen === this.options.screens['BASKET_MODAL'] as string) {
        this.basket.total = this.basketModel.getTotal();
      }
      // Отключение кнопки при пустой корзине
      if (this.basketModel.items.length === 0) {
        this.basket.toggleButton(true);
      } else {
        this.basket.toggleButton(false);
      }
    })

    // Рендер модального окна с карточкой товара при выборе карточки на главном экране
    this.events.on(this.options.events['CARD_SELECT'] as string, (item: IItem) => {
      this.modal.render({
        content: this.itemPreview.render({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          price: item.price,
          image: item.image,
        })
      });
      this.events.emit(this.options.events['SCREEN_CHANGED'] as string, { current: this.options.screens['ITEM_MODAL'] as string });
      this.modal.open();
    });

    // Добавление товара в корзину и обновление счетчика товаров в корзине на главной странице
    this.events.on(this.options.events['BASKET_ADD'] as string, (item: IItem) => {
      this.basketModel.addItem(item);
      this.page.counter = this.basketModel.items.length;
    })

    // Удаление товара из корзины и обновление счетчика товаров в корзине на главной странице
    this.events.on(this.options.events['BASKET_REMOVE'] as string, (data: { item: IItem, index: number }) => {
      this.basketModel.removeItem(data.index);
      this.page.counter = this.basketModel.items.length;
    })

    // Блокирует прокрутку главной страницы при открытии модального окна
    this.events.on(this.options.events['MODAL_OPEN'] as string, () => {
      this.page.locked = true;
    });

    // Разрешает прокрутку главной страницы при закрытии модального окна
    this.events.on(this.options.events['MODAL_CLOSE'] as string, () => {
      this.page.locked = false;
      this.events.emit(this.options.events['SCREEN_CHANGED'] as string, { current: this.options.screens['MAIN_SCREEN'] as string });
    });

    // Рендер корзины при ее открытии
    this.events.on(this.options.events['BASKET_OPEN'] as string, () => {
      this.modal.render({ content: this.basket.render() });
      if (this.basketModel.items.length === 0) {
        this.basket.toggleButton(true);
      } else {
        this.basket.toggleButton(false);
      }
      this.basket.total = this.basketModel.getTotal();
      this.events.emit(this.options.events['SCREEN_CHANGED'] as string, { current: this.options.screens['BASKET_MODAL'] as string});
      this.modal.open();
    });

    // Рендер формы заказа
    this.events.on(this.options.events['FORM_ORDER'] as string, () => {
      this.modal.render({ content: this.formOrder.render() });
      if (this.basketModel.payment && this.basketModel.address) {
        this.formOrder.toggleButton(false);
        this.formOrder.error = '';
      } else {
        this.formOrder.error = 'Выберите способ оплаты и введите адрес доставки.';
        this.formOrder.toggleButton(true);
      }
      this.events.emit(this.options.events['SCREEN_CHANGED'] as string, { current: this.options.screens['ORDER_MODAL'] as string});
      this.modal.open();
    });

    // Рендер формы контактов
    this.events.on(this.options.events['FORM_CONTACTS'] as string, () => {
      this.modal.render({ content: this.formContacts.render() });
      if (this.basketModel.email && this.basketModel.phone) {
        this.formContacts.toggleButton(false);
        this.formContacts.error = '';
      } else {
        this.formContacts.error = 'Введите email и телефон.';
        this.formContacts.toggleButton(true);
      }
      this.events.emit(this.options.events['SCREEN_CHANGED'] as string, { current: this.options.screens['CONTACTS_MODAL'] as string});
      this.modal.open();
    });

    this.events.on(this.options.events['FORM_CHANGED'] as string, (data: Partial<IOrder>) => {
      // Проверка на валидность форм
      if (this.basketModel.payment && this.basketModel.address) {
        this.formOrder.toggleButton(false);
        this.formOrder.error = '';
      } else {
        this.formOrder.error = 'Выберите способ оплаты и введите адрес доставки.';
        this.formOrder.toggleButton(true);
      }
      if (this.basketModel.email && this.basketModel.phone) {
        this.formContacts.toggleButton(false);
        this.formContacts.error = '';
      } else {
        this.formContacts.error = 'Введите email и телефон.';
        this.formContacts.toggleButton(true);
      }
      // Внесение валидных данных в модель
      if (data.payment) {
        this.basketModel.payment = data.payment;
        this.formOrder.selectPayment(this.basketModel.payment);
      }
      if (data.address) {
        this.basketModel.address = data.address;
      }
      if (data.email) {
        const isValid = this.basketModel.validate({ email: data.email });
        if (isValid) {
          this.basketModel.email = data.email;
        } else {
          this.formContacts.error = 'Введите корректный email. Пример: example@yandex.ru';
        }
      }
      if (data.phone) {
        const isValid = this.basketModel.validate({ phone: data.phone });
        if (isValid) {
          this.basketModel.phone = data.phone;
        } else {
          this.formContacts.error = 'Введите корректный телефон. Пример: +7(000)000-00-00';
        }
      }
    });

    // Отправка заказа на сервер, обработка ответа сервера
    this.events.on(this.options.events['FORM_SUBMIT'] as string, () => {
      this.api.makeOrder(this.basketModel.getOrder())
        .then((data: IOrderResult) => {
          this.events.emit(this.options.events['FORM_SUCCESS'] as string, data);
        })
        .catch((error: IErrorResponse) => {
          alert(error.error);
        })
    });

    // Рендер модального окна об успешном заказе, очистка корзины и сброс счетчика корзины
    this.events.on(this.options.events['FORM_SUCCESS'] as string, (data: IOrderResult) => {
      this.modal.render({ content: this.successView.render() });
      this.successView.description = { payment: this.basketModel.payment, total: data.total };
      this.basketModel.clearOrder();
      this.page.counter = 0;
      this.modal.open();
    })

    // Обновляет статус текущего экрана
    this.events.on(this.options.events['SCREEN_CHANGED'] as string, (screen: { current: string }) => {
      this.currentScreen = screen.current;
    });
  }
}