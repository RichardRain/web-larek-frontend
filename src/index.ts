import './scss/styles.scss';

import { API_URL, CDN_URL, settings } from "./utils/constants";
import { LarekApi } from './components/LarekApi'
import { EventEmitter } from './components/base/events';
import {Presenter} from './components/Presenter';
import { TOptions } from './types';

// Инициализация api и events
const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const options: TOptions = settings;

// Инициализация презентера
const presenter = new Presenter(api, events, options);

// Инициализация работы приложения
presenter.init();