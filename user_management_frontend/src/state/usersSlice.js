export const types = {
  LIST_REQUEST: 'users/LIST_REQUEST',
  LIST_SUCCESS: 'users/LIST_SUCCESS',
  LIST_FAILURE: 'users/LIST_FAILURE',

  GET_REQUEST: 'users/GET_REQUEST',
  GET_SUCCESS: 'users/GET_SUCCESS',
  GET_FAILURE: 'users/GET_FAILURE',

  CREATE_REQUEST: 'users/CREATE_REQUEST',
  CREATE_SUCCESS: 'users/CREATE_SUCCESS',
  CREATE_FAILURE: 'users/CREATE_FAILURE',

  UPDATE_REQUEST: 'users/UPDATE_REQUEST',
  UPDATE_SUCCESS: 'users/UPDATE_SUCCESS',
  UPDATE_FAILURE: 'users/UPDATE_FAILURE',

  DELETE_REQUEST: 'users/DELETE_REQUEST',
  DELETE_SUCCESS: 'users/DELETE_SUCCESS',
  DELETE_FAILURE: 'users/DELETE_FAILURE'
};

export const usersInitialState = {
  list: [],
  byId: {},
  loading: {
    list: false,
    detail: false,
    create: false,
    update: false,
    remove: false
  },
  error: {
    list: null,
    detail: null,
    create: null,
    update: null,
    remove: null
  }
};

function upsertById(byId, user) {
  return { ...byId, [user.id]: user };
}
function removeById(byId, id) {
  const next = { ...byId };
  delete next[id];
  return next;
}

export function usersReducer(state = usersInitialState, action) {
  switch (action.type) {
    case types.LIST_REQUEST:
      return { ...state, loading: { ...state.loading, list: true }, error: { ...state.error, list: null } };
    case types.LIST_SUCCESS: {
      const nextById = { ...state.byId };
      action.payload.forEach(u => { nextById[u.id] = u; });
      return {
        ...state,
        list: action.payload.map(u => u.id),
        byId: nextById,
        loading: { ...state.loading, list: false },
        error: { ...state.error, list: null }
      };
    }
    case types.LIST_FAILURE:
      return { ...state, loading: { ...state.loading, list: false }, error: { ...state.error, list: action.error || 'Failed to load users' } };

    case types.GET_REQUEST:
      return { ...state, loading: { ...state.loading, detail: true }, error: { ...state.error, detail: null } };
    case types.GET_SUCCESS: {
      const user = action.payload;
      return {
        ...state,
        byId: upsertById(state.byId, user),
        loading: { ...state.loading, detail: false },
        error: { ...state.error, detail: null }
      };
    }
    case types.GET_FAILURE:
      return { ...state, loading: { ...state.loading, detail: false }, error: { ...state.error, detail: action.error || 'Failed to load user' } };

    case types.CREATE_REQUEST:
      return { ...state, loading: { ...state.loading, create: true }, error: { ...state.error, create: null } };
    case types.CREATE_SUCCESS: {
      const user = action.payload;
      const already = state.list.includes(user.id);
      return {
        ...state,
        list: already ? state.list : [user.id, ...state.list],
        byId: upsertById(state.byId, user),
        loading: { ...state.loading, create: false },
        error: { ...state.error, create: null }
      };
    }
    case types.CREATE_FAILURE:
      return { ...state, loading: { ...state.loading, create: false }, error: { ...state.error, create: action.error || 'Failed to create user' } };

    case types.UPDATE_REQUEST:
      return { ...state, loading: { ...state.loading, update: true }, error: { ...state.error, update: null } };
    case types.UPDATE_SUCCESS: {
      const user = action.payload;
      return {
        ...state,
        byId: upsertById(state.byId, user),
        loading: { ...state.loading, update: false },
        error: { ...state.error, update: null }
      };
    }
    case types.UPDATE_FAILURE:
      return { ...state, loading: { ...state.loading, update: false }, error: { ...state.error, update: action.error || 'Failed to update user' } };

    case types.DELETE_REQUEST:
      return { ...state, loading: { ...state.loading, remove: true }, error: { ...state.error, remove: null } };
    case types.DELETE_SUCCESS: {
      const id = action.payload;
      return {
        ...state,
        list: state.list.filter(x => x !== id),
        byId: removeById(state.byId, id),
        loading: { ...state.loading, remove: false },
        error: { ...state.error, remove: null }
      };
    }
    case types.DELETE_FAILURE:
      return { ...state, loading: { ...state.loading, remove: false }, error: { ...state.error, remove: action.error || 'Failed to delete user' } };

    default:
      return state;
  }
}
