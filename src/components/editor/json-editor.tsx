'use client';

import { useRef, useEffect } from 'react';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  placeholder as placeholderExt,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { json } from '@codemirror/lang-json';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { lintGutter } from '@codemirror/lint';
import {
  syntaxHighlighting,
  HighlightStyle,
  bracketMatching,
} from '@codemirror/language';
import { tags } from '@lezer/highlight';

const editorTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'transparent',
      color: '#E2E8F0',
      height: '100%',
    },
    '.cm-content': {
      caretColor: '#3B82F6',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      fontSize: '14px',
      lineHeight: '1.6',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#3B82F6',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
    },
    '.cm-gutters': {
      backgroundColor: '#0F172A',
      color: '#64748B',
      border: 'none',
      borderRight: '1px solid #475569',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 8px',
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '.cm-matchingBracket': {
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      color: '#E2E8F0',
    },
    '.cm-nonmatchingBracket': {
      backgroundColor: 'rgba(239, 68, 68, 0.3)',
      color: '#EF4444',
    },
    '.cm-scroller': {
      overflow: 'auto',
    },
    '.cm-placeholder': {
      color: '#64748B',
      fontStyle: 'italic',
    },
  },
  { dark: true }
);

const syntaxTheme = HighlightStyle.define([
  { tag: tags.string, color: '#22C55E' },
  { tag: tags.number, color: '#F59E0B' },
  { tag: tags.bool, color: '#A78BFA' },
  { tag: tags.null, color: '#64748B' },
  { tag: tags.propertyName, color: '#3B82F6' },
  { tag: tags.punctuation, color: '#94A3B8' },
  { tag: tags.brace, color: '#94A3B8' },
  { tag: tags.squareBracket, color: '#94A3B8' },
]);

interface JsonEditorProps {
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export function JsonEditor({
  value,
  onChange,
  readOnly = false,
  placeholder,
}: JsonEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const extensions = [
      json(),
      editorTheme,
      syntaxHighlighting(syntaxTheme),
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      history(),
      bracketMatching(),
      lintGutter(),
      highlightSelectionMatches(),
      keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const doc = update.state.doc.toString();
          onChange?.(doc);
        }
      }),
    ];

    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true));
    }

    if (placeholder) {
      extensions.push(placeholderExt(placeholder));
    }

    const state = EditorState.create({
      doc: value,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only run on mount/unmount — value updates handled by the next effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly, placeholder]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[200px] overflow-auto"
    />
  );
}
