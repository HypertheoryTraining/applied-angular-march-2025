import { inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  setEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ReadingListApiService } from './reading-list-data';
import { mergeMap, switchMap, tap } from 'rxjs';

export type ReadingListItem = {
  id: string;
  titleId: string;
  note: string;
  addedAt: string;
};

export function withReadingList() {
  return signalStoreFeature(
    withEntities({
      entity: type<ReadingListItem>(),
      collection: 'readingList',
    }),
    withMethods((store) => {
      const api = inject(ReadingListApiService);
      return {
        loadReadingList: rxMethod<void>(
          switchMap(() =>
            api
              .getReadingList()
              .pipe(
                tap((items) =>
                  patchState(
                    store,
                    setEntities(items, { collection: 'readingList' }),
                  ),
                ),
              ),
          ),
        ),
        deleteFromReadingList: rxMethod<string>(
          mergeMap((id) =>
            api.deleteFromReadingList(id).pipe(
              tap(() =>
                patchState(
                  store,
                  removeEntity(id, { collection: 'readingList' }), // remove the item from the store
                ),
              ),
            ),
          ),
        ),
        updateReadingListItem: rxMethod<{
          item: ReadingListItem;
          note: string;
        }>(
          mergeMap(({ item, note }) =>
            api.updateReadingListItem(item, note).pipe(
              tap((item) =>
                patchState(
                  store,
                  addEntity(item, { collection: 'readingList' }), // add the item to the store
                ),
              ),
            ),
          ),
        ),
        addItemToReadingList: rxMethod<{ id: string; note: string }>(
          mergeMap(({ id, note }) =>
            api.addToReadingList({ id, note }).pipe(
              tap((item) =>
                patchState(
                  store,
                  addEntity(item, { collection: 'readingList' }), // add the item to the store
                ),
              ),
            ),
          ),
        ),
      };
    }),
  );
}
