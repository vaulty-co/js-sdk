## Playground for Vaulty JS SDK

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How to use

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

Before that, you should run development build for elements and library:

```
cd ../elements
yarn dev
```

```
cd ../library
yarn start
```

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

**Notice** Currently, it is not used. Because, playground is mostly used for developing and debugging SDK library
and elements iframe source. 

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
