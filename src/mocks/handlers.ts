import { Books_Handlers } from './books-handlers';
import { LinkHandlers } from './links-handlers';
import { ReadingListhandler } from './reading-list-handler';

export const handlers = [
  ...LinkHandlers,
  ...Books_Handlers,
  ...ReadingListhandler,
];
