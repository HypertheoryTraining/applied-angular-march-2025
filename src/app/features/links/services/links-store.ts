import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ApiLink } from '../types';
import { computed, inject } from '@angular/core';
import { LinksDataService } from './links-data';
import { interval, switchMap, tap } from 'rxjs';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { withReadingList } from './reading-list-store-feature';
type ApiLinkModel = ApiLink & { onReadingList: boolean };
export const LinksStore = signalStore(
  withEntities<ApiLink>(),
  withReadingList(),
  withDevtools('links'),
  withState({
    selectedId: undefined as string | undefined,
    isFetching: false,
    filteringBy: undefined as string | undefined,
  }),
  withMethods((store) => {
    const service = inject(LinksDataService);
    return {
      setFilteringBy: (filteringBy: string | undefined) =>
        patchState(store, { filteringBy }),

      setSelectedId: (id: string) => patchState(store, { selectedId: id }),
      clearSelectedId: () => patchState(store, { selectedId: undefined }),
      loadLinks: rxMethod<void>(
        switchMap(() => {
          patchState(store, { isFetching: true });
          return service
            .getLinks()
            .pipe(
              tap((link) =>
                patchState(store, setEntities(link), { isFetching: false }),
              ),
            );
        }),
      ),
    };
  }),
  withComputed((store) => {
    return {
      uniqueTags: computed(() => {
        const links = store.entities();
        if (!links) return [];
        const tags = [...links]
          .flatMap((link) => link.tags) // take a bunch of links [{... tags?: []}] and give me [... tags]
          .filter(Boolean); // take out anything that doesn't match this predicate ()

        return Array.from(new Set(tags));
      }),

      listOfLinks: computed(() => {
        const links = store.entities();
        const filter = store.filteringBy();
        const itemsOnReadingList = store
          .readingListEntities()
          .flatMap((item) => item.titleId);
        if (filter) {
          return links
            ?.filter((link) => link.tags?.includes(filter))
            .map((l) => mapToLinkModel(l, itemsOnReadingList));
        }

        return links.map((l) => mapToLinkModel(l, itemsOnReadingList));
      }),
      selectedLink: computed(() => {
        const id = store.selectedId();
        const itemsOnReadingList = store
          .readingListEntities()
          .flatMap((item) => item.titleId);
        if (!id) return undefined;
        const link = store.entities().find((link) => link.id === id);
        if (link) {
          const note =
            store.readingListEntities().find((item) => item.titleId === id)
              ?.note || '';
          const model = mapToLinkModel(link, itemsOnReadingList);
          return {
            ...model,
            note,
          };
        }
        return undefined;
      }),
      readingList: computed(() => {
        const readingList = store.readingListEntities();
        const links = store.entities();
        if (!links) return [];
        if (!readingList) return [];
        return readingList.map((item) => {
          const link = links.find((link) => link.id === item.titleId);
          if (!link) return undefined;
          return {
            ...item,
            ...link,
          };
        });
      }),
    };
  }),
  withHooks({
    onInit(store) {
      console.log('The LinksStore has been initialized');
      store.loadLinks();
      store.loadReadingList();

      interval(1000 * 60 * 5)
        .pipe(
          takeUntilDestroyed(),
          tap(() => store.loadLinks()),
        )
        .subscribe();
    },
    onDestroy() {
      console.log('The LinksStore has been destroyed');
    },
  }),
);

function mapToLinkModel(link: ApiLink, favorites: string[]): ApiLinkModel {
  return {
    ...link,
    onReadingList: favorites.some((i) => link.id === i),
  };
}
