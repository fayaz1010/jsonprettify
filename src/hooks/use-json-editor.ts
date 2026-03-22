import { useReducer, useCallback } from 'react';
import type { EditorState, EditorAction, JsonError } from '@/types';

const initialState: EditorState = {
  input: '',
  output: '',
  error: null,
  activeAction: null,
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: action.payload };
    case 'SET_OUTPUT':
      return { ...state, output: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ACTION':
      return { ...state, activeAction: action.payload };
    case 'CLEAR':
      return { ...initialState };
    default:
      return state;
  }
}

export function useJsonEditor() {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const setInput = useCallback((input: string) => {
    dispatch({ type: 'SET_INPUT', payload: input });
  }, []);

  const setOutput = useCallback((output: string) => {
    dispatch({ type: 'SET_OUTPUT', payload: output });
  }, []);

  const setError = useCallback((error: JsonError | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setAction = useCallback((action: string | null) => {
    dispatch({ type: 'SET_ACTION', payload: action });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return {
    state,
    setInput,
    setOutput,
    setError,
    setAction,
    clear,
  };
}
