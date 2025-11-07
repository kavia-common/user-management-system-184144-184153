import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppState } from '../state/store';
import { types } from '../state/usersSlice';
import { useToast } from '../components/ui/Toast';

/**
 * PUBLIC_INTERFACE
 * useUsers provides users list/detail CRUD functions and exposes loading/error states.
 * API calls are stubbed with setTimeout to simulate network latency.
 */
export default function useUsers() {
  const { users } = useAppState();
  const dispatch = useAppDispatch();
  const toast = useToast();

  // Utilities for generating demo data and simulating latency
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));
  const demoUsers = useMemo(
    () => ([
      { id: 'u_1001', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
      { id: 'u_1002', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
      { id: 'u_1003', name: 'Charlie Davis', email: 'charlie@example.com', role: 'Viewer' }
    ]),
    []
  );

  const list = useCallback(async () => {
    dispatch({ type: types.LIST_REQUEST });
    try {
      await wait(400);
      dispatch({ type: types.LIST_SUCCESS, payload: demoUsers });
    } catch (e) {
      dispatch({ type: types.LIST_FAILURE, error: String(e?.message || e) });
    }
  }, [dispatch, demoUsers]);

  const getById = useCallback(async (id) => {
    dispatch({ type: types.GET_REQUEST });
    try {
      await wait(250);
      const found = users.byId[id] || demoUsers.find(u => u.id === id);
      if (!found) throw new Error('User not found');
      dispatch({ type: types.GET_SUCCESS, payload: found });
      return found;
    } catch (e) {
      const msg = String(e?.message || e);
      dispatch({ type: types.GET_FAILURE, error: msg });
      return null;
    }
  }, [dispatch, users.byId, demoUsers]);

  const create = useCallback(async (payload) => {
    dispatch({ type: types.CREATE_REQUEST });
    try {
      await wait(300);
      const id = `u_${Math.random().toString(36).slice(2, 8)}`;
      const user = { id, ...payload };
      dispatch({ type: types.CREATE_SUCCESS, payload: user });
      toast.show({ title: 'User created', description: `${user.name} has been created`, variant: 'success' });
      return user;
    } catch (e) {
      const msg = String(e?.message || e);
      dispatch({ type: types.CREATE_FAILURE, error: msg });
      toast.show({ title: 'Create failed', description: msg, variant: 'error' });
      return null;
    }
  }, [dispatch, toast]);

  const update = useCallback(async (id, payload) => {
    dispatch({ type: types.UPDATE_REQUEST });
    try {
      await wait(300);
      const existing = users.byId[id] || demoUsers.find(u => u.id === id);
      if (!existing) throw new Error('User not found');
      const user = { ...existing, ...payload, id };
      dispatch({ type: types.UPDATE_SUCCESS, payload: user });
      toast.show({ title: 'User updated', description: `${user.name} has been saved`, variant: 'success' });
      return user;
    } catch (e) {
      const msg = String(e?.message || e);
      dispatch({ type: types.UPDATE_FAILURE, error: msg });
      toast.show({ title: 'Update failed', description: msg, variant: 'error' });
      return null;
    }
  }, [dispatch, users.byId, demoUsers, toast]);

  const remove = useCallback(async (id) => {
    dispatch({ type: types.DELETE_REQUEST });
    try {
      await wait(250);
      dispatch({ type: types.DELETE_SUCCESS, payload: id });
      toast.show({ title: 'Deleted', description: 'User deleted', variant: 'success' });
      return true;
    } catch (e) {
      const msg = String(e?.message || e);
      dispatch({ type: types.DELETE_FAILURE, error: msg });
      toast.show({ title: 'Delete failed', description: msg, variant: 'error' });
      return false;
    }
  }, [dispatch, toast]);

  const listData = useMemo(() => users.list.map(id => users.byId[id]).filter(Boolean), [users.list, users.byId]);

  return {
    // state
    users: listData,
    byId: users.byId,
    loading: users.loading,
    error: users.error,
    // actions
    list,
    getById,
    create,
    update,
    remove
  };
}
