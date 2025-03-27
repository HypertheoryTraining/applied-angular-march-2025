import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CardComponent } from '@app-shared/components';
import { map, tap } from 'rxjs';
import { LinksStore } from '../services/links-store';
import { HeartFullComponent } from './heart-full';
import { HeartHollowComponent } from './heart-hollow';

@Component({
  selector: 'app-links-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    HeartFullComponent,
    HeartHollowComponent,
  ],
  template: `
    @if (store.listOfLinks()) {
      <router-outlet />
      <div class="flex flex-row flex-wrap gap-2">
        @if (store.filteringBy()) {
          <a [routerLink]="[]" [queryParams]="{}" class="btn"> Show All </a>
        }
        @for (tag of store.uniqueTags(); track tag) {
          <a
            [routerLink]="[]"
            [queryParams]="{ tag }"
            [routerLinkActive]="['btn-primary']"
            [class.btn-ghost]="
              store.filteringBy() !== tag && store.filteringBy() !== undefined
            "
            class="btn"
          >
            {{ tag }}
          </a>
        }
      </div>
      <div class="flex flex-row flex-wrap gap-4">
        @for (link of store.listOfLinks(); track link.id) {
          <app-card [title]="link.title">
            <p class="text-accent">{{ link.description }}</p>
            <a target="_blank" [href]="link.url" class="link" [title]="link.url"
              ><span class="w-fit overflow-ellipsis">{{ link.url }}</span></a
            >
            <div class="flex flex-row gap-4">
              @for (tag of link.tags; track tag) {
                <a
                  [routerLink]="[]"
                  [queryParams]="{ tag }"
                  class="badge badge-primary"
                  >{{ tag }}</a
                >
              }
            </div>
            <div class="flex flex-row gap-4">
              @if (link.onReadingList) {
                <a [routerLink]="[link.id]">
                  <app-heart-full></app-heart-full>
                </a>
              } @else {
                <a [routerLink]="[link.id]">
                  <app-heart-hollow></app-heart-hollow
                ></a>
              }
            </div>
          </app-card>
        } @empty {
          <p>Sorry, you have no links!</p>
        }
      </div>
    } @else {
      <p>Nothing yet..</p>
    }
  `,
  styles: ``,
})
export class ListComponent {
  #activatedRoute = inject(ActivatedRoute);
  store = inject(LinksStore);
  constructor() {
    this.#activatedRoute.queryParamMap
      .pipe(
        map((params) => params.get('tag')),
        tap((tag) => this.store.setFilteringBy(tag || undefined)),
        takeUntilDestroyed(), // this is super cool. can eliminate a lot of janky code.
      )
      .subscribe();
  }

  // a computed signal that gives me all the unique tags from the listOfLinks
}
