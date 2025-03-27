import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-heart-hollow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <span class="text-gray-400 text-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
        <path
          fill="currentColor"
          d="M12 14.3q1.275-1.175 2.063-1.937t1.212-1.313t.575-.962T16 9.2q0-.9-.65-1.55T13.8 7q-.525 0-1.013.213T12 7.8q-.3-.375-.775-.587T10.2 7q-.9 0-1.55.65T8 9.2q0 .475.137.875t.563.95t1.2 1.313T12 14.3M5 21V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v16l-7-3z"
        />
      </svg>
    </span>
  `,
  styles: ``,
})
export class HeartHollowComponent {}
