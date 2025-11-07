import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppState } from '../state/store';
import { types } from '../state/usersSlice';
import { useToast } from '../components/ui/Toast';
import apiClient from '../api/client';
import usersApi from '../api/users';

/**
 * PUBLIC_INTERFACE
 * useUsers provides users list/detail CRUD functions and exposes loading/error states.
 * Uses backend API when configured, falls back to local demo data otherwise.
 */
export default function useUsers() {
  const { users } = useAppState();
  const dispatch = useAppDispatch();
  const toast = useToast();

  // Base URL presence determines whether backend is configured.
  const hasBackend = Boolean(apiClient.baseURL);

  // Utilities for demo fallback
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));
  const demoUsers = useMemo(
    () => ([
      { id: 'u_1001', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
      { id: 'u_1002', name: 'Bob Smith', email: 'bob@example.com', role: 'editor' },
      { id: 'u_1003', name: 'Charlie Davis', email: 'charlie@example.com', role: 'viewer' }
    ]),
    []
  );

  const list = useCallback(async () => {
    dispatch({ type: types.LIST_REQUEST });
    try {
      let data;
      if (hasBackend) {
        try {
          data = await usersApi.list();
        } catch (e) {
          // Graceful fallback if backend unreachable
          data = null;
          console.warn('Users list API failed, falling back to demo data:', e);
        }
      }
      if (!data) {
        await wait(300);
        data = demoUsers;
      }
      dispatch({ type: types.LIST_SUCCESS, payload: data });
    } catch (e) {
      dispatch({ type: types.LIST_FAILURE, error: String(e?.message || e) });
    }
  }, [dispatch, demoUsers, hasBackend]);

  const getById = useCallback(async (id) => {
    dispatch({ type: types.GET_REQUEST });
    try {
      let user = null;
      if (hasBackend) {
        try {
          user = await usersApi.getById(id);
        } catch (e) {
          console.warn('Users getById API failed, falling back to demo/local data:', e);
        }
      }
      if (!user) {
        await wait(200);
        user = users.byId[id] || demoUsers.find(u => u.id === id);
      }
      if (!user) throw new Error('User not found');
      dispatch({ type: types.GET_SUCCESS, payload: user });
      return user;
    } catch (e) {
      const msg = String(e?.message || e);
      dispatch({ type: types.GET_FAILURE, error: msg });
      return null;
    }
  }, [dispatch, users.byId, demoUsers, hasBackend]);

  const create = useCallback(async (payload) => {
    dispatch({ type: types.CREATE_REQUEST });
    try {
      let user;
      if (hasBackend) {
        try {
          user = await usersApi.create(payload);
        } catch (e) {
          console.warn('Users create API failed, falling back to local create:', e);
        }
      }
      if (!user) {
        await wait(250);
        const id = `u_${Math.random().toString(36).slice(2, 8)}`;
        user = { id, ...payload };
      }
      dispatch({ type: types.CREATE_SUCCESS, payload: user });
      toast.show({ title: 'User created', description: `${user.name} has been created`, variant: 'success' });
      return user;
    } catch (e) {
      const msg = String(e?.message || e);
      dispatch({ type: types.CREATE_FAILURE, error: msg });
      toast.show({ title: 'Create failed', description: msg, variant: 'error' });
      return null;
    }
  }, [dispatch, toast, hasBackend]);

  const update = useCallback(async (id, payload) => {
    dispatch({ type: types.UPDATE_REQUEST });
    try {
      let user = null;
      if (hasBackend) {
        try {
          user = await usersApi.update(id, payload);
        } catch (e) {
          console.warn('Users update API failed, falling back to local update:', e);
        }
      }
      if (!user) {
        await wait(250);
        const existing = users.byId[id] || demoUsers.find(u => u.id === id);
        if (!existing) throw new Error('User not found');
        user = { ...existing, ...payload, id };
      }
      dispatch({ type: types.UPDATE_SUCCESS, payload: user });
      toast.show({ title: 'User updated', description: `${user.name} has been saved`, variant: 'success' });
      return user;
    } catch (e) {
      const msg = String(e?.message || e);
      dispatch({ type: types.UPDATE_FAILURE, error: msg });
      toast.show({ title: 'Update failed', description: msg, variant: 'error' });
      return null;
    }
  }, [dispatch, users.byId, demoUsers, toast, hasBackend]);

  const remove = useCallback(async (id) => {
    dispatch({ type: types.DELETE_REQUEST });
    try {
      let ok = false;
      if (hasBackend) {
        try {
          await usersApi.remove(id);
          ok = true;
        } catch (e) {
          console.warn('Users delete API failed, falling back to local remove:', e);
        }
      }
      if (!ok) {
        await wait(200);
      }
      dispatch({ type: types.DELETE_SUCCESS, payload: id });
      toast.show({ title: 'Deleted', description: 'User deleted', variant: 'success' });
      return true;
    } catch (e) {
      const msg = String(e?.message || e);
      dispatch({ type: types.DELETE_FAILURE, error: msg });
      toast.show({ title: 'Delete failed', description: msg, variant: 'error' });
      return false;
    }
  }, [dispatch, toast, hasBackend]);

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
