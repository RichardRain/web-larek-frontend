export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
  events: {
    ['BASKET_ADD']: 'basket:add',
    ['BASKET_CHANGED']: 'basket:changed',
    ['BASKET_REMOVE']: 'basket:remove',
    ['BASKET_OPEN']: 'basket:open',
    ['FORM_ORDER']: 'form:order',
    ['FORM_CONTACTS']: 'form:contacts',
    ['FORM_SUBMIT']: 'form:submit',
    ['FORM_SUCCESS']: 'form:success',
    ['FORM_CHANGED']: 'form:changed',
    ['CATALOG_CHANGED']: 'catalog:changed',
    ['CARD_SELECT']: 'card:select',
    ['SCREEN_CHANGED']: 'screen:changed',
    ['MODAL_OPEN']: 'modal:open',
    ['MODAL_CLOSE']: 'modal:close',
  },
  screens: {
    ['MAIN_SCREEN']: 'main-screen',
    ['ORDER_SUCCESS']: 'order-success',
    ['ORDER_MODAL']: 'order-modal',
    ['CONTACTS_MODAL']: 'contacts-modal',
    ['BASKET_MODAL']: 'basket-modal',
    ['ITEM_MODAL']: 'item-modal',
  },
  blocks: {
    modal: 'modal',
    card: 'card',
    basket: 'basket',
    form: 'form',
  },
  regex: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /\+\d\(\d{3}\)\d{3}\-\d{2}\-\d{2}/,
  }
};
