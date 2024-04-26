import './scss/styles.scss';
import { API_URL, CDN_URL } from "./utils/constants";
import { LarekApi } from './components/LarekApi'
import { IItem } from './types/index';
import { CatalogModel, CatalogChangeEvent, BasketModel, BasketChangeEvent } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import {ItemModal} from './components/ItemModal';
import {BasketItem, BasketModal} from './components/BasketModal';
import { cloneTemplate, ensureElement } from './utils/utils';

const pageElement = ensureElement('.page');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modalElement = ensureElement<HTMLDivElement>('#modal-container');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const larek = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const catalogModel = new CatalogModel([], events);
const basketModel = new BasketModel([], events);
const page = new Page(pageElement, events);
const itemPreview:ItemModal = new ItemModal('card', modalElement, events);
const basketModal = new BasketModal('basket', modalElement, events, cloneTemplate(basketTemplate));


larek.getItemList().then((items) => {
  items.forEach((item) => {
    catalogModel.addItem(item);
  });
});

events.on<CatalogChangeEvent>('catalog:changed', () => {
  page.catalog = catalogModel.items.map((item) => {
    const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
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

events.on<BasketChangeEvent>('basket:changed', () => {
  basketModal.items = basketModel.items.map((item, index) => {
    const basketItem = new BasketItem(cloneTemplate(basketItemTemplate));
    // basketItem.content = cloneTemplate(basketItemTemplate);
    basketItem.setButtonAction({
      onClick: () => events.emit('basket:remove', item)
    });
    return basketItem.render({
      title: item.title,
      id: item.id,
      index: index + 1,
      price: item.price,
    });
  });
  if (basketModal.isOpen) {
    basketModal.list = basketModal.items;
    basketModal.total = basketModel.getTotal();
  }
})

events.on('card:select', (item: IItem) => {
  itemPreview.content = cloneTemplate(cardPreviewTemplate);
  itemPreview.setButtonAction({
    onClick: () => events.emit('basket:add', catalogModel.getItem(itemPreview.id)) // переписать в фунцию чтобы добавлять и удалять слушатель
  });
  itemPreview.id = item.id;
  itemPreview.title = item.title;
  itemPreview.description = item.description;
  itemPreview.category = item.category;
  itemPreview.price = item.price;
  itemPreview.image = item.image;
  itemPreview.open();
});


events.on('basket:add', (item: IItem) => {
  itemPreview.close();
  basketModel.addItem(item);
  page.counter = basketModel.items.length;
})

events.on('basket:remove', (item: IItem) => {
  basketModel.removeItem(item.id);
  page.counter = basketModel.items.length;
})

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
  if (basketModal.isOpen) {
    basketModal.isOpen = false;
  }
});

events.on('basket:open', () => {
  basketModal.content = cloneTemplate(basketTemplate);
  basketModal.list = basketModal.items;
  basketModal.total = basketModel.getTotal();
  basketModal.open();
  basketModal.isOpen = true;
});