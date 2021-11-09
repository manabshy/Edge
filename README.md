# Wedge

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Developing with Storybook

To run storybook in development run `npm run storybook` and once running open localhost:6060 in a browser to view storybook.  Open the component(s) you're working on from the sidebar and develop away. Use the .stories files of your components to manage the different states of your component for each story and to set Inputs & Outputs.

For more information on storybook see src/stories/Introductions.stories.mdx

## Storybook static site for team use
Run `npm run storybook-build` to generate a static website of the component library that can be deployed to test/qa environments for team consumption and discussion. TODO: css style imports incomplete on build (some CSS needs importing from somewhere)

## Documentation

This application uses Compodoc to generate a static documentation website.  It follows typedoc conventions for structuring comments in the code.
Storybook also has a docs plugin that leverages these same comments to provide documetation there, also.

## Running scripts
if running scripts has been disabled by admin persmissions then you may need a way of running update schematics or other dev scripts. One way around this is to run the scripts via package.json scripts block. From there you can use packages such as rimraf to remove node_modules etc etc