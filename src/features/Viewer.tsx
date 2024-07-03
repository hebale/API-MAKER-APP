import { useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import Editor, { useMonaco } from '@monaco-editor/react';
import CircularProgress from '@mui/material/CircularProgress';
import type { editor } from 'monaco-editor';
import type { OnMount } from '@monaco-editor/react';

type ViewerProps = {
  language?: string;
  height?: number | 'auto';
  value: string;
};

const Viewer = ({ language = 'json', height = 'auto', value }: ViewerProps) => {
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

    editor.layout({ width: contentWidth, height: contentHeight });
  }, [height]);

  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.onDidContentSizeChange(autoHeight);
  };

  return (
    <Box
      sx={{
        border: '1px solid #ddd',
        '& .monaco-editor .view-overlays .current-line': {
          display: 'none',
        },
      }}
    >
      <Editor
        loading={<CircularProgress thickness={5} />}
        defaultLanguage={language}
        value={value}
        onMount={onMount}
        options={{
          fontSize: 13,
          tabSize: 2,
          minimap: { enabled: false },
          roundedSelection: true,
          scrollBeyondLastLine: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbers: 'off',
          readOnly: true,
        }}
        {...(height !== 'auto' && { height })}
      />
    </Box>
  );
};

export default Viewer;
