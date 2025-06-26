import { ChangeDetectionStrategy, Component } from '@angular/core';

interface MenuOption {
  label: string;
  subLabel: string;
  router: string;
  icon: string;
}

@Component({
  selector: 'gifs-side-menu-options',
  imports: [],
  templateUrl: './side-menu-options.component.html',
  styleUrl: './side-menu-options.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuOptionsComponent { }
