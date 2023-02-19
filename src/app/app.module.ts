import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import json from 'highlight.js/lib/languages/json';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ErrorComponent } from './pages/error/error.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroComponent } from './components/hero/hero.component';
import { HomeContentComponent } from './components/home-content/home-content.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ExternalApiComponent } from './pages/external-api/external-api.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { environment as env } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    NavBarComponent,
    FooterComponent,
    HeroComponent,
    HomeContentComponent,
    LoadingComponent,
    ExternalApiComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    HighlightModule,
    FontAwesomeModule,
    AuthModule.forRoot({
      //...env.auth,
      domain: 'dev-stableprice.us.auth0.com',
      clientId: 'aioYUEOdGqlIcGDWrFmsf1tlvXnUslG0',
      authorizationParams: {
        //redirect_uri: window.location.origin
        // Request this audience at user authentication time
        audience: 'https://dev-stableprice.us.auth0.com/api/v2/',
        // Request this scope at user authentication time
        scope: 'read:current_user',
      },
      httpInterceptor: {
        //...env.httpInterceptor,
        allowedList: [
          {
            // Match any request that starts 'https://dev-stableprice.us.auth0.com/api/v2/' (note the asterisk)
            uri: 'https://dev-stableprice.us.auth0.com/api/v2/*',
            tokenOptions: {
              authorizationParams: {
                // The attached token should target this audience
                audience: 'https://dev-stableprice.us.auth0.com/api/v2/',
    
                // The attached token should have these scopes
                scope: 'read:current_user'
              }
            }
          }
        ]
        
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    {
      provide: Window,
      useValue: window,
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          json: () => import('highlight.js/lib/languages/json'),
        },
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
