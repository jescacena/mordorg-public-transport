# El intercambiador de Mordorg


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.0.

> ng --version

```
@angular/cli: 1.1.0
node: 7.7.4
os: darwin x64
@angular/animations: 4.1.3
@angular/common: 4.1.3
@angular/compiler: 4.1.3
@angular/core: 4.1.3
@angular/forms: 4.1.3
@angular/http: 4.1.3
@angular/platform-browser: 4.1.3
@angular/platform-browser-dynamic: 4.1.3
@angular/router: 4.1.3
@angular/cli: 1.1.0
@angular/compiler-cli: 4.1.3
@angular/language-service: 4.1.3
@types/lodash: 4.14.75
@types/leaflet: 1.2.0
leaflet: 1.1.0
```

## Local development

> npm start

* Hit `localhost:4200`

## Unit testing

> ng test


## Build bundle with webpack + AoT in PRODUCTION

> npm run build


## Test PRODUCTION bundle in local

> npm run serve

* Hit `localhost:3000`


=======

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Development server linked to IP (Mobile device testing)
* Get ip from `ifconfig`
* Edit package.json and edit ip startip script
* Run `npm run startip` for a dev server. Navigate to `http://<your-ip>:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

```
npm version major|minor|patch
```


Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

Buil for PRODUCTION
```
ng build --pro --aot --base-href http://intercambiador.cercemap.org
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Creating videos and gifs for presentations
* Creation of video with **Quicktime** --> Archivo --> Nueva grabación de pantalla
* **Convert mov video to gif**: open terminal:
```
ffmpeg -i directio-selector.mov -s 350x650 -pix_fmt rgb24 -r 10 -f gif - | gifsicle --optimize=3 --delay=3 > out.gif
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
>>>>>>> chore: initial commit from @angular/cli
