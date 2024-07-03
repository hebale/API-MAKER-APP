import React, { useRef, useCallback } from 'react';
import { Stack, Box } from '@mui/material';
import Editor, { useMonaco } from '@monaco-editor/react';
import CircularProgress from '@mui/material/CircularProgress';
import type { editor } from 'monaco-editor';
import type { Monaco, OnMount } from '@monaco-editor/react';

type MonacoProps = {
  language?: string;
  height?: number | 'auto';
  defaultValue?: string;
  value?: string;
  schemas?: any[];
  options?: editor.IStandaloneEditorConstructionOptions;
  onChange?: (value: string) => void;
  onValidate?: (marker: editor.IMarker[], value?: string) => void;
  children?: any;
};

const Monaco = ({
  language = 'json',
  height = 'auto',
  defaultValue,
  value,
  schemas,
  options,
  onChange,
  onValidate,
  children,
}: MonacoProps) => {
  const editorRef = useRef<null | editor.IStandaloneCodeEditor>(null);
  const monaco = useMonaco();

  const autoHeight = useCallback(() => {
    const editor = editorRef.current;

    if (!editor) return;
    const container = editor.getDomNode();
    const contentWidth = editor.getContainerDomNode().clientWidth;
    const contentHeight =
      typeof height === 'string'
        ? editor.getContentHeight()
        : Math.min(height, editor.getContentHeight() ?? height);

    (container as HTMLElement).style.height = `${contentHeight}px`;

    editor.layout({ width: contentWidth - 1, height: contentHeight });
  }, [height]);

  const onBeforeMount = (monaco: Monaco) => {
    schemas &&
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas,
      });
  };

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.onDidContentSizeChange(autoHeight);
  };

  const onChangeCode = () => {
    onChange && onChange(editorRef.current?.getValue() as string);
  };

  return (
    <Box className="monaco-box">
      {children && (
        <Stack className="editor-ribbon" flexDirection="row">
          {children}
        </Stack>
      )}
      <Editor
        loading={<CircularProgress thickness={5} />}
        defaultLanguage={language}
        defaultValue={defaultValue}
        value={value}
        beforeMount={onBeforeMount}
        onMount={onMount}
        onChange={onChangeCode}
        onValidate={(marker) =>
          onValidate && onValidate(marker, editorRef.current?.getValue())
        }
        options={{
          fontSize: 13,
          tabSize: 2,
          minimap: { enabled: false },
          roundedSelection: true,
          scrollBeyondLastLine: false,
          ...options,
        }}
        {...(height !== 'auto' && { height })}
      />
    </Box>
  );
};

export default Monaco;
