import './scss/styles.scss';
import { API_URL, CDN_URL } from "./utils/constants";
import { LarekApi } from './components/LarekApi'
import { IItem } from './types/index';
import { CatalogModel, CatalogChangeEvent } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import {ItemModal} from './components/ItemModal';
import { cloneTemplate, ensureElement } from './utils/utils';

const pageElement = ensureElement('.page');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modalElement = ensureElement<HTMLDivElement>('#modal-container');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const larek = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const catalogModel = new CatalogModel([], events);
const page = new Page(pageElement, events);
const itemPreview:ItemModal = new ItemModal('card', modalElement, events);
const basketModal = new Modal('basket', modalElement, events);

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

events.on('card:select', (item: IItem) => {
  itemPreview.content = cloneTemplate(cardPreviewTemplate);
  itemPreview.setButtonAction({
    onClick: () => events.emit('basket:add', catalogModel.getItem(itemPreview.id))
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
  basketModal.content = cloneTemplate(basketTemplate);
  basketModal.open();
})

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});