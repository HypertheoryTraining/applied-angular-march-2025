import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ReadingListItem } from './reading-list-store-feature';

export class ReadingListApiService {
  #http = inject(HttpClient);
  getReadingList() {
    return this.#http.get<ReadingListItem[]>('/api/user/reading-list');
  }
  addToReadingList({ id, note }: { id: string; note: string }) {
    return this.#http.post<ReadingListItem>('/api/user/reading-list', {
      id,
      note,
    });
  }
  deleteFromReadingList(id: string) {
    return this.#http.delete<void>(`/api/user/reading-list/${id}`);
  }
  updateReadingListItem(item: ReadingListItem, note: string) {
    return this.#http.put<ReadingListItem>(
      `/api/user/reading-list/${item.id}`,
      { ...item, note },
    );
  }
}
