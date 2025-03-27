import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LinksStore } from '../services/links-store';
import { ReadingListItem } from '../services/reading-list-store-feature';
@Component({
  selector: 'app-link-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <dialog #detailsModal class="modal">
      @if (store.selectedLink()) {
        @let link = store.selectedLink()!;
        <div class="modal-box">
          <h3 class="text-lg font-bold">{{ link.title }}</h3>
          <p>{{ link.description }} {{ id() }}</p>

          <form [formGroup]="form" (ngSubmit)="addToReadingList()" class="pt-4">
            <label class="floating-label">
              <span>Note</span>
              <textarea
                formControlName="note"
                placeholder="Note for reading list"
                class="input input-md"
                rows="8"
              ></textarea>
            </label>
            @if (link.onReadingList) {
              <button type="submit" class="btn btn-primary">
                Update Note In Reading List
              </button>
              <button
                type="button"
                class="btn btn-error"
                (click)="removeFromReadingList(link.id)"
              >
                Remove from Reading List
              </button>
            } @else {
              <button type="submit" class="btn btn-primary">
                Add To Reading List
              </button>
            }
          </form>
          <div class="modal-action">
            <form method="dialog" (submit)="close()">
              <button type="submit" class="btn btn-primary">Close</button>
            </form>
          </div>
        </div>
      }
    </dialog>
  `,
  styles: ``,
})
export class DetailsComponent implements OnInit {
  id = input.required<string>();
  store = inject(LinksStore);
  modal = viewChild<ElementRef<HTMLDialogElement>>('detailsModal');
  form = new FormGroup({
    note: new FormControl<string>('', { nonNullable: true }),
  });
  ngOnInit() {
    this.modal()?.nativeElement.showModal();
    this.store.setSelectedId(this.id());
  }

  constructor() {
    effect(() => {
      const link = this.store.selectedLink();
      if (link) {
        this.form.patchValue({
          note: link.note,
        });
      }
    });
  }
  location = inject(Location);
  close() {
    this.store.clearSelectedId();
    this.location.back();
  }

  addToReadingList() {
    // this.store.additemToReadingList
    if (this.store.selectedLink()?.onReadingList) {
      this.store.updateReadingListItem({
        item: this.store.selectedLink()! as unknown as ReadingListItem,
        note: this.form.controls.note.value,
      });
    } else {
      this.store.addItemToReadingList({
        id: this.id(),
        note: this.form.controls.note.value,
      });
    }
    this.close();
  }
  removeFromReadingList(id: string) {
    this.store.deleteFromReadingList(id);
    this.close();
  }
}
