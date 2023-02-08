# Auth0 Angular Library

### Requirements

This project only supports the [actively supported versions of Angular as stated in the Angular documentation](https://angular.io/guide/releases#actively-supported-versions). Whilst other versions might be compatible they are not actively supported.

### Installation

Using npm:

```sh
npm install @auth0/auth0-angular
```

The library can also be installed using the Angular CLI:

```sh
ng add @auth0/auth0-angular
```

### Configure the SDK

#### Static configuration

Install the SDK into your application by importing `AuthModule.forRoot()` and configuring with your Auth0 domain and client id, as well as the URL to which Auth0 should redirect back after succesful authentication:

```ts
import { NgModule } from '@angular/core';
import { AuthModule } from '@auth0/auth0-angular';

@NgModule({
  // ...
  imports: [
    AuthModule.forRoot({
      domain: 'YOUR_AUTH0_DOMAIN',
      clientId: 'YOUR_AUTH0_CLIENT_ID',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ],
  // ...
})
export class AppModule {}
```

#### Dynamic configuration

Instead of using `AuthModule.forRoot` to specify auth configuration, you can provide a factory function using `APP_INITIALIZER` to load your config from an external source before the auth module is loaded, and provide your configuration using `AuthClientConfig.set`.

The configuration will only be used initially when the SDK is instantiated. Any changes made to the configuration at a later moment in time will have no effect on the default options used when calling the SDK's methods. This is also the reason why the dynamic configuration should be set using an `APP_INITIALIZER`, because doing so ensures the configuration is available prior to instantiating the SDK.

> :information_source: Any request made through an instance of `HttpClient` that got instantiated by Angular, will use all of the configured interceptors, including our `AuthHttpInterceptor`. Because the `AuthHttpInterceptor` requires the existence of configuration settings, the request for retrieving those dynamic configuration settings should ensure it's not using any of those interceptors. In Angular, this can be done by manually instantiating `HttpClient` using an injected `HttpBackend` instance.

```js
import { AuthModule, AuthClientConfig } from '@auth0/auth0-angular';

// Provide an initializer function that returns a Promise
function configInitializer(
  handler: HttpBackend,
  config: AuthClientConfig
) {
  return () =>
    new HttpClient(handler)
      .get('/config')
      .toPromise()
      // Set the config that was loaded asynchronously here
      .then((loadedConfig: any) => config.set(loadedConfig));
}

export class AppModule {
  // ...
  imports: [
    HttpClientModule,
    AuthModule.forRoot(), // <- don't pass any config here
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configInitializer, // <- pass your initializer function here
      deps: [HttpBackend, AuthClientConfig],
      multi: true,
    },
  ],
  // ...
}
```

### Add login to your application

To log the user into the application, inject the `AuthService` and call its `loginWithRedirect` method.

```ts
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public auth: AuthService) {}

  loginWithRedirect() {
    this.auth.loginWithRedirect();
  }
```

By default the application will ask Auth0 to redirect back to the root URL of your application after authentication. This can be configured by setting the [redirectUri](https://auth0.github.io/auth0-angular/interfaces/AuthorizationParams.html#redirect_uri) option.

For more code samples on how to integrate the **auth0-angular** SDK in your **Angular** application, have a look at our [examples](https://github.com/auth0/auth0-angular/tree/master/EXAMPLES.md).

## API reference

- [AuthService](https://auth0.github.io/auth0-angular/classes/AuthService.html) - service used to interact with the SDK.
- [AuthConfig](https://auth0.github.io/auth0-angular/interfaces/AuthConfig.html) - used to configure the SDK.

## Features
This angular application performs via Auth0:

- Login
- Log out
- Showing the user profile
- Protecting routes using the authentication guard
- Calling APIs with automatically-attached bearer tokens

# Install
## Configuration

The app needs to be configured with your Auth0 domain and client ID in order to work. In the root of the sample, copy `auth_config.json.example` and rename it to `auth_config.json`. Open the file and replace the values with those from your Auth0 tenant:

```json
{
  "domain": "<YOUR AUTH0 DOMAIN>",
  "clientId": "<YOUR AUTH0 CLIENT ID>",
  "audience": "<YOUR AUTH0 API AUDIENCE IDENTIFIER>"
}
```

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

This will automatically start a Node + Express server as the backend on port `3001`. The Angular application is configured to proxy through to this on any `/api` route.

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist/login-demo` directory. Use the `--prod` flag for a production build.

To build and run a production bundle and serve it, run `npm run prod`. The application will run on `http://localhost:3000`.

## Run Using Docker

You can build and run the sample in a Docker container by using the provided scripts:

```bash
# In Linux / MacOS
sh exec.sh

# Windows Powershell
./exec.ps1
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


