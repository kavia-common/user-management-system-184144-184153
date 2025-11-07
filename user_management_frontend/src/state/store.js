import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { usersInitialState, usersReducer } from './usersSlice';

/**
 * PUBLIC_INTERFACE
 * AppProvider wraps the app and provides a global state via Context and useReducer.
 * It composes slice reducers (currently: users) into a single app reducer.
 */

const AppStateContext = createContext(null);
const AppDispatchContext = createContext(null);

// Combine slice states into one initial state
const initialState = {
  users: usersInitialState
};

// Root reducer combining slice reducers
function rootReducer(state, action) {
  return {
    users: usersReducer(state.users, action)
  };
}

// PUBLIC_INTERFACE
export function AppProvider({ children }) {
  /**
   * Provides { state, dispatch } contexts for the app.
   */
  const [state, dispatch] = useReducer(rootReducer, initialState);

  // Memoize values to avoid unnecessary renders
  const stateValue = useMemo(() => state, [state]);
  const dispatchValue = useMemo(() => dispatch, [dispatch]);

  return (
    <AppStateContext.Provider value={stateValue}>
      <AppDispatchContext.Provider value={dispatchValue}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAppState() {
  /** Returns the global state object. Must be used within AppProvider. */
  const ctx = useContext(AppStateContext);
  if (ctx === null) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

// PUBLIC_INTERFACE
export function useAppDispatch() {
  /** Returns the global dispatch function. Must be used within AppProvider. */
  const ctx = useContext(AppDispatchContext);
  if (ctx === null) throw new Error('useAppDispatch must be used within AppProvider');
  return ctx;
}
