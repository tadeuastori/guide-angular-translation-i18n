import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, TranslocoModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('guide-angular-translations-i18n');
  private translocoService = inject(TranslocoService);

  constructor() {
  }

  ngOnInit() {
    //Set the default language to English
    this.translocoService.setActiveLang('en-us');
  }

  //To set the language dynamically based on the user selection
  changeLang(lang?: string) {

    if (!lang) {
      return;
    }

    this.translocoService.setActiveLang(lang);

    console.log(`Language changed to ${lang}`);
  }
}
