import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const initialState = {};

const middleware = [thunk];

export const store = createStore(
  persistedReducer,
  initialState,
  // ...middleware -> cala zawartosc const middleware
  composeWithDevTools(applyMiddleware(...middleware)),
);

export const persistor = persistStore(store);

export default store;


