import { delay, http, HttpResponse } from 'msw';
import { ReadingListItem } from '../app/features/links/services/reading-list-store-feature';

const fakeReadingList: ReadingListItem[] = [];
export const ReadingListhandler = [
  http.get('/api/user/reading-list', async () => {
    await delay();
    return HttpResponse.json(fakeReadingList);
  }),
  http.post('/api/user/reading-list', async ({ request }) => {
    await delay();
    const { id, note } = (await request.json()) as unknown as {
      id: string;
      note: string;
    };
    const newItem: ReadingListItem = {
      id: crypto.randomUUID(),
      titleId: id,
      note,
      addedAt: new Date().toISOString(),
    };
    fakeReadingList.push(newItem);
    return HttpResponse.json(newItem);
  }),
  http.delete('/api/user/reading-list/:id', async ({ params }) => {
    await delay();
    const id = params['id'] as string;
    const index = fakeReadingList.findIndex((item) => item.titleId === id);
    if (index !== -1) {
      fakeReadingList.splice(index, 1);
    }
    return new HttpResponse('', { status: 204 });
  }),
  http.put('/api/user/reading-list/:id', async ({ params, request }) => {
    await delay();
    const id = params['id'] as string;
    const index = fakeReadingList.findIndex((item) => item.titleId === id);
    if (index !== -1) {
      const { note } = (await request.json()) as unknown as {
        note: string;
      };
      fakeReadingList[index].note = note;
    }
    return HttpResponse.json(fakeReadingList.find((item) => item.id === id));
  }),
];
