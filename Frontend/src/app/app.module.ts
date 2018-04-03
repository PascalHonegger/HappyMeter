import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, LOCALE_ID } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Import swiss german
import { registerLocaleData } from '@angular/common';
import localeDeCh from '@angular/common/locales/de-ch';

registerLocaleData(localeDeCh);

// External libraries
import { BarChartModule } from '@swimlane/ngx-charts';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { WebcamModule } from 'ngx-webcam';

/*
 * Platform and Environment providers/directives/pipes
 */
import { environment } from 'environments/environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';

// Different sites
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FaceComponent } from './face/face.component';
import { FacialRecognitionComponent } from './facial-recognition/facial-recognition.component';
import { AdministrationComponent } from './administration/administration.component';
import { StatisticsComponent } from './statistics/statistics.component';

// Dialog contents
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { SelectEmojiDialogComponent } from './select-emoji-dialog/select-emoji-dialog.component';

// Help components
import { EmojiDisplayComponent } from './emoji-display/emoji-display.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { FaceRepresentationComponent } from './face-representation/face-representation.component';

// 404 not found page
import { NoContentComponent } from './no-content/no-content.component';

// Services
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { EmotionalStateService } from './services/emotional-state.service';
import { EmotionService } from './services/emotion.service';
import { DataParserService } from './services/data-parser.service';
import { SpamProtectionService } from './services/spam-protection.service';
import { FaceApiService } from './services/face-api.service';
import { EmojiService } from './services/emoji.service';

// Interceptors
import { AuthorizeInterceptor } from './interceptors/authorize.interceptor';
import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';

// Guards
import { CanActivateViaAuthGuard } from './guards/can-activate-via-auth.guard';

// Material 2
import {
  MatButtonModule,
  MatToolbarModule,
  MatDialogModule,
  MatTooltipModule,
  MatInputModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MatTabsModule,
  MatCardModule,
  MatIconModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

import '../styles/styles.scss';

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdministrationComponent,
    FaceComponent,
    FacialRecognitionComponent,
    FaceRepresentationComponent,
    StatisticsComponent,
    EmojiDisplayComponent,
    CommentListComponent,
    ErrorDialogComponent,
    SelectEmojiDialogComponent,
    NoContentComponent
  ],
  entryComponents: [
    ErrorDialogComponent,
    SelectEmojiDialogComponent
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
      useHash: true,
      preloadingStrategy: PreloadAllModules
    }),
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    BarChartModule,
    PickerModule,
    WebcamModule
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    environment.ENV_PROVIDERS,
    Title,
    UserService,
    EmotionalStateService,
    EmotionService,
    FaceApiService,
    EmojiService,
    DataParserService,
    SpamProtectionService,
    AuthService,
    CanActivateViaAuthGuard,
    {
      provide: LOCALE_ID,
      useValue: 'de-CH'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizeInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    }
  ]
})
export class AppModule {

}
