import React from 'react';
import { Box } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'link',
  'image',
  'color',
  'background',
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  error,
  helperText,
}) => {
  return (
    <Box
      sx={{
        '& .ql-container': {
          height: '300px',
          fontSize: '1rem',
          border: (theme) =>
            error
              ? `2px solid ${theme.palette.error.main}`
              : `1px solid ${theme.palette.divider}`,
          borderTop: 'none',
          borderBottomLeftRadius: 1,
          borderBottomRightRadius: 1,
        },
        '& .ql-toolbar': {
          border: (theme) =>
            error
              ? `2px solid ${theme.palette.error.main}`
              : `1px solid ${theme.palette.divider}`,
          borderBottom: 'none',
          borderTopLeftRadius: 1,
          borderTopRightRadius: 1,
        },
        '& .ql-editor': {
          minHeight: '300px',
        },
      }}
    >
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
      />
      {error && helperText && (
        <Box
          sx={{
            color: 'error.main',
            mt: 0.5,
            ml: 1.75,
            fontSize: '0.75rem',
          }}
        >
          {helperText}
        </Box>
      )}
    </Box>
  );
};

export default RichTextEditor;
