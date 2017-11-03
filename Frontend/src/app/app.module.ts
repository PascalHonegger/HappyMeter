import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';

// Different sites
import { HelloComponent } from './hello/hello.component';

// 404 not found page
import { NoContentComponent } from './no-content/no-content.component';

// Services
import { AuthService } from './services/auth.service';
import { ServerService } from './services/server.service';

// Interceptors
import { TokenInterceptor } from './interceptors/token.interceptor';

// Material 2
import {
  MatButtonModule,
  MatToolbarModule
} from '@angular/material';
import 'hammerjs';

import '../styles/styles.scss';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    HelloComponent,
    NoContentComponent
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    }),
    MatButtonModule,
    MatToolbarModule,
    FlexLayoutModule
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    ENV_PROVIDERS,
    Title,
    ServerService,
    AuthService,
    {
      provide: LOCALE_ID,
      useValue: 'de-CH' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class AppModule {

}
