# 🗃️ Guide - Angular Translations I18n

🔴 Step-by-step guide and reference template for implementing internationalization (i18n) in Angular using Transloco.

![angular](https://img.shields.io/badge/Angular-%5E22.0.1-ff0000?style=plastic&logo=angular) ![transloco](https://img.shields.io/badge/Transloco-%5E8.4.0-00e9ff?style=plastic&logo=languagetool) ![bootstrap](https://img.shields.io/badge/Bootstrap-%5E5.3-5300ff?style=plastic&logo=bootstrap)

---

## 🌐 About Internationalization (i18n) and Transloco lib

Internationalization (i18n) is the process of designing and preparing a frontend application to support multiple languages, formats, and cultural conventions without requiring structural changes to the codebase.

Transloco allows you to define translations for your content in different languages and switch between them easily in runtime.

<div style="text-align: center;">
  <a href="https://jsverse.gitbook.io/transloco" target="_blank" rel="noopener noreferrer">
    <img src="https://raw.githubusercontent.com/jsverse/transloco/refs/heads/master/logo.svg" alt="Transloco Official Webpage" width="20%">
    <p>Transloco Official Webpage</p>
  </a>
</div>

---

## ⚡ Quick Links

* [1. Installation Commands](#1--installation)
* [2. Transloco Configuration](#2-%EF%B8%8F-configuration)
* [3. How to Use in HTML/TS](#3--how-to-use)
* [4. Get from State](#4--example-of-how-to-get-language-setting-from-state)

---

## 1. 🛠 Installation

Run this command in your terminal to install Transloco:

```bash
ng add @jsverse/transloco
```

During the installation, you can either install Transloco without creating any JSON file, or you can create the files for all languages you need. I recommend creating at least one during the installation.

> On this guide, we are implementing 2 languages: __en-us__, __pt-br__, and __fr-fr__

```bash
# CMD interaction to choose which languages you need
Which languages do you need? pt-br, en-us, fr-fr
```

After the installation, a couple of files shall be created and updated inside the project, including all JSON files (one per language you informed).

---

## 2. ⚙️ Configuration

#### 🗂️ Translation Files Locations

```text
guide-angular-translation-i18n
│
├─ package-lock.json              # Updated
├─ package.json                   # Updated
├─ public
│  └─ i18n                        # Created
│     ├─ en-us.json               # Created - JSON boilerplate
│     └─ pt-br.json               # Created - JSON boilerplate
│     └─ fr-fr.json               # Created - JSON boilerplate
├─ src
│  ├─ app
│  │  ├─ app.config.ts            # Updated
│  │  └─ transloco-loader.ts      # Created
├─ transloco.config.ts            # Created
```

---

#### 📄 JSON base structure

Transloco creates __boilerplate__ files for the requested languages with an __empty JSON__:

__`[YOUR_LANG].json`__

```json
{
  "key 01": "value",
  "key 02": "value"
}
```

Also, you can create a linked structure, for example, by page or by form:

```json
{
  "application": {
      "app_name": "guide-angular-translations-i18n",
      "description": "Guide to implement translations i18n in Angular projects"     
  },
  "block": {
      "menu":"Menu Example",
      "alerts": "Dialog Message Example",
      "buttons": "Buttons Example",
      "modal": "Modal Example"
  },
  "menu": {
      "home": "Home",
      "product": "Product",
      "contact": "Contact",
      "about": "About"      
  },
  "buttons": {
      "confirm":"Confirm",
      "cancel":"Cancel",
      "back":"Back",
      "add":"Add",
      "delete":"Delete",
      "close":"Close",
      "save":"Save",
      "open_modal":"Open Modal"
  },
  "alerts": {
      "file_uploade": "The file was uploaded",
      "form_sent": "The form was sent.",
      "image_deleted": "The Imagem was deleted",
      "new_message" : "You have a new message"
  }, 
  "modal": {
      "title":"Modal title"    
  },
  "labels": {
      "using_pipe": "Using Pipe",
      "using_directive": "Using Directive"
  },
  "languages": {
      "english": "English",
      "portuguese": "Portuguese",
      "french": "French (Language not available)"
  }
}
```

> This is the structure we are using in all JSON files in this Guide.
>
> | File Name  | Language         | Status     |
> | -----------| ---------------- | ---------- |
> | en-us.json | __English__      | OK         |
> | pt-br.json | __Portuguese__   | OK         |
> | fr-fr.json | __French__       | Empty File |
>

---

#### 📄 Typescript files

* The file `app.config.ts` was updated with the necessary imports and providers. It should be implemented like the code below:

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// ADDED BY TRANSLOCO
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // ADDED BY TRANSLOCO
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['pt-br', 'en-us'],
        defaultLang: 'en-us',        
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
```

> On __`defaultLang`__ is where we set the default language if the selected language is not found.
> On __`availableLangs`__ is where we are listing all supported languages.

* The file `transloco-loader.ts` was created to load the JSON file regarding the selected language by the user.

```typescript
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    // Relative path recommended for avoiding deploy errors
    return this.http.get<Translation>(`./i18n/${lang}.json`);
  }
}
```

* The file `transloco.config.ts` is used by tools & plugins such as the scoped lib extractor and the keys manager. You can read more about it [here](https://jsverse.gitbook.io/transloco/developer-tools/global-config).

---

## 3. 💻 How to Use

#### In Typescript Components

1. On `app.component.ts` file:
    1. Import `inject` and `TranslocoService`
    2. Add `TranslocoModule` on __@Component > imports: []__
    3. Implement `OnInit` class and `ngOnInit` method

    ```typescript
    import { Component, OnInit, inject } from '@angular/core';
    import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

    @Component({
      selector: 'app-root',
      imports: [TranslocoModule],
      templateUrl: './app.component.html'
    })
    export class AppComponent implements OnInit {
      private translocoService = inject(TranslocoService);

      ngOnInit() {        
        this.translocoService.setActiveLang('en-us');
      }

      changeLang(lang?: string) {
        if (!lang) return;
        this.translocoService.setActiveLang(lang);
      }
    }
    ```

#### In HTML Templates (Structural Directive)

> Recommended approach for better performance:

```html
<ng-container *transloco="let t">
  <h1>{{ t('application.app_name') }}</h1>
  <p>{{ t('application.description') }}</p>
</ng-container>
```

#### In HTML Templates (Pipe)

> Another option is using the __transloco pipe__:

```html
<span>{{ 'home' | transloco }}</span>
```

> You can use it with __params__:

```html
<span>{{ 'alert' | transloco: { value: dynamic } }}</span>
```

> It can also be used with __bindings__ or __inputs__:

```html
<span [attr.alt]="'hello' | ...">Attribute</span>
<span [title]="'hello' | transloco">Property</span>
<my-comp [label]="'hello' | transloco" />
```

---

## 4. 🤓 Example of how to get language setting from State

This advanced example shows how to sync Transloco with your application state (e.g., NgRx) and automatically fallback to the user's Operating System (OS) language if supported.

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store'; // Ensure your state manager import is here
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

import { ApplicationStateSelectors } from './core/states/application.queries';
import { ISetting } from './core/models/setting/setting.model';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  private _store = inject(Store);
  private _translocoService = inject(TranslocoService);
  private _languageService = inject(LanguageService);

  currentLanguage: string = '';
  
  applicationSettings\$: Observable<ISetting> = this._store.select(
    ApplicationStateSelectors.getApplicationSettings
  );

  constructor() {
    // Automatically track active language changes
    this._translocoService.langChanges\$
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (lang) => {
          this.currentLanguage = lang;
        },
      });
  }

  ngOnInit(): void {
    // Listen to application settings and detect OS language
    this.applicationSettings\$
      .pipe(takeUntilDestroyed()) // Modern way to auto-unsubscribe on destroy
      .subscribe({
        next: (settings) => {
          const deviceLanguage: string = navigator.language.toLowerCase();
          const languageList = this._languageService.getLanguageList();

          // Check if the OS language is implemented in the app
          if (languageList.some((l) => l.code === deviceLanguage)) {
            this._translocoService.setActiveLang(deviceLanguage);
          } else {
            // Default fallback language if OS language is not supported
            this._translocoService.setActiveLang('en-us'); 
          }
        },
      });
  }
}
```
