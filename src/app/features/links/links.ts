import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SectionNavComponent } from '../../../shared/components/section-nav/section-nav';
import { LinksStore } from './services/links-store';
import { LinksDataService } from './services/links-data';
import { ReadingListApiService } from './services/reading-list-data';

@Component({
  selector: 'app-links',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LinksStore, LinksDataService, ReadingListApiService],
  imports: [SectionNavComponent],
  template: `
    <app-section-nav
      sectionName="Developer Resources"
      [links]="[
        {
          label: 'List',
          href: '/links/list',
        },
        {
          label: 'Reading List',
          href: '/links/reading-list',
        },
      ]"
    >
      <div class="h-4 w-full">
        @if (store.isFetching()) {
          <progress class="progress progress-info w-full"></progress>
        }
      </div>
    </app-section-nav>
  `,
  styles: ``,
})
export class LinksComponent {
  store = inject(LinksStore);
}
