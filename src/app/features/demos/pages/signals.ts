import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { OddEvenIndicatorComponent } from '../components/odd-even-indicator';
import { ButtonDirective } from '@app-shared/directives';

@Component({
  selector: 'app-demos-signals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OddEvenIndicatorComponent, ButtonDirective],
  template: `
    <p>A Basic Signals Example</p>
    <div class="pb-4">
      <button (click)="decrement()" appButton round>-</button>
      <span class="m-4 text-md font-bold">{{ current() }}</span>
      <button (click)="increment()" appButton round>+</button>
    </div>
    @if (showReset()) {
      <button (click)="current.set(0)" class="" appButton>Reset!</button>
    } @else {
      <p>Click the buttons!</p>
    }
    @defer {
      <div class="p-4">
        <app-odd-even-indicator [current]="current()" />
      </div>
    }

    @for (n of range(6); track $index) {
      <p>thing</p>
    }
  `,
  styles: ``,
})
export class SignalsDemoComponent {
  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
  current = signal(0);

  showReset = computed(() => this.current() !== 0);

  decrement() {
    this.current.update((c) => c - 1);
  }
  increment() {
    this.current.update((c) => c + 1);
  }
}
