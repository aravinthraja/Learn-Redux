import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { syncHistory } from 'redux-simple-router'; 

// Import some dummy data - this could come from an API
import rootReducer from './reducers/index';

import { createHistory } from 'history'


/*
  Store

  Redux apps have a single store which takes
  1. All Reducers which we combined into `rootReducer`
  2. An optional starting state - similar to React's getInitialState
*/

const defaultState = {
  posts : [],
  comments : {}
};

/*
  Create our store which will hold all of our data.
  Normally this would look like this:

    const store = createStore(rootReducer, defaultState);

  But we are using the redux dev tools chrome extension and the redux-simple-router so it requires a little more setup. 
*/

const history = createHistory();
const reduxRouterMiddleware = syncHistory(history);
const createStoreWithDevTools = (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore);
const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware)(createStoreWithDevTools);
const store = createStoreWithMiddleware(rootReducer, defaultState);

/*
  Sync History to Store
*/

reduxRouterMiddleware.syncHistoryToStore(store);

/*
  Enable Hot Reloading for the reducers
  We re-require() the reducers whenever any new code has been written.
  Webpack will handle the rest
*/

if(module.hot) {
  module.hot.accept('./reducers/', () => {
    const nextRootReducer = require('./reducers/index').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
