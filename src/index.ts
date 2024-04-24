import './scss/styles.scss';
import {API_URL, CDN_URL} from "./utils/constants";
import {LarekApi} from './components/LarekApi'
import {IItem} from './types/index';
import {CatalogModel, CatalogChangeEvent} from './components/AppData';
import {EventEmitter} from './components/base/events';
import {Card} from './components/Card';
import {Page} from './components/Page';
import {cloneTemplate, ensureElement} from './utils/utils';

const larek = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const catalogModel = new CatalogModel([], events);
const page = new Page(document.querySelector('.Page'), events);
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

larek.getItemList().then((items) => {
  items.forEach((item) => {
    catalogModel.addItem(item);
  });
});

events.on<CatalogChangeEvent>('catalog:changed', ()  => {
  page.catalog = catalogModel.items.map((item) => {
    const card = new Card('card', cloneTemplate(cardTemplate), {
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
  alert(`Click on ${item.id}`);
})


larek.getItem('854cef69-976d-4c2a-a18c-2aa45046c390').then((item) => console.log(item));