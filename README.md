# Wedge

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server(s)

>> npm scripts in package.json:
"start:dev": "ng serve --hmr -c=dev", 
"start:local": "ng serve --hmr -c=local",
"start:test": "ng serve --hmr -c=test",

--hmr flag is for Hot Module Reloading. 
-c flag points to respective configurations in angular.json file. 

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Full Stack Development
Run `npm run start:local` for a dev server pointed at localhost API. You will need to ensure the baseUrl address is pointed to the correct port where Edge API project is running.

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

### Deploying storybook to Chromatic
To deploy the Storybook to the cloud run `npm run chromatic` and the Storybook tool will run and deploy to the cloud.  This can then be visited via the given url and reviewed there.

### Updating Storybook package
To update to the latest version of Storbook run `npx sb@latest upgrade`

## Documentation

This application uses Compodoc to generate a static documentation website.  It follows typedoc conventions for structuring comments in the code.
Storybook also has a docs plugin that leverages these same comments to provide documetation there, also.

## Running scripts
if running scripts has been disabled by admin persmissions then you may need a way of running update schematics or other dev scripts. One way around this is to run the scripts via package.json scripts block. From there you can use packages such as rimraf to remove node_modules etc etc

## Releasing
- this project follows Semantic Versioning (semver https://semver.org/) and the version number from the package.json file is displayed in the sidenav of the UI to show the user what version of the code they're on.  This helps during dev & testing to make sure we're on the version we think we should be on!
- when creating a release that will go to either dev,test,prod then be sure to bump the version number in package.json.
- most of the time you will be incrementing the pre-release number which comes after a hyphen on the main version you're working to get released into production.
- for example, 4.0.0-60
- here 4 is the major version, 0 minor, 0 patch - 60 prerelease
- once all dev is done for a version then bump prerelease to -beta and then drop that flag when it goes to production as simply 4.0.0 (no prerelease tags)

Folder Structure
Currently the folder structure is a bit messy and could use some restructuring to make it easier to navigate and find things.

- try to follow a similar structure to the side navigation of the application in order to make it a bit clearer where components live.

dashboard
  - calendar
  - rewards (to move)

contacts
  - contact-centre (to move)
  - company-centre (to move)
  - leads (to move)

properties
  - property-centre (to move)
  - valuations (to move)
  - instructions (done)

shared
- tidy up the shared folder and move all components into components folder and make them part of the components.module

Things to do to folder organisation in order to reach a cleaner structure
- move valuations folder into properties folder 
- redundant files... there appear to be a lot of component files that aren't being used anywhere in the application. They should be grouped together out of the way or deleted if not going to be used.
