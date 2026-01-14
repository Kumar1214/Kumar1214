import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

const RichTextEditor = ({ value, onChange, placeholder, minHeight = '200px' }) => {
    const editor = useRef(null);

    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || 'Start typing...',
        minHeight: minHeight,
        toolbar: true,
        spellcheck: true,
        language: 'en',
        toolbarButtonSize: 'medium',
        toolbarAdaptive: false,
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        buttons: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            '|',
            'ul',
            'ol',
            '|',
            'font',
            'fontsize',
            '|',
            'outdent',
            'indent',
            'align',
            '|',
            'link',
            'image',
            '|',
            'undo',
            'redo',
            '|',
            'hr',
            'eraser',
            'fullsize'
        ],
        style: {
            background: '#ffffff',
            color: '#000000'
        }
    }), [placeholder, minHeight]);

    return (
        <div className="rich-text-editor">
            <JoditEditor
                ref={editor}
                value={value || ''}
                config={config}
                onBlur={newContent => onChange(newContent)}
                onChange={newContent => { }}
            />
            <style>{`
                .jodit-container {
                    border-radius: 0.5rem;
                    border: 1px solid #e5e7eb;
                }
                .jodit-toolbar__box {
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    background: #f9fafb;
                }
                .jodit-workplace {
                    border-bottom-left-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
                }
                .jodit-wysiwyg {
                    min-height: ${minHeight};
                    font-size: 1rem;
                    padding: 12px;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
