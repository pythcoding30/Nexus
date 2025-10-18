import { useState, useRef, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current && !isFocused) {
      editorRef.current.innerHTML = value
    }
  }, [value, isFocused])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  return (
    <div style={{
      border: '1px solid #333',
      borderRadius: '6px',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        gap: '0.25rem',
        padding: '0.5rem',
        borderBottom: '1px solid #333',
        backgroundColor: '#1a1a1a',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          onClick={() => execCommand('bold')}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #333',
            borderRadius: '4px',
            backgroundColor: '#262626',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600
          }}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #333',
            borderRadius: '4px',
            backgroundColor: '#262626',
            color: '#fff',
            cursor: 'pointer',
            fontStyle: 'italic'
          }}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #333',
            borderRadius: '4px',
            backgroundColor: '#262626',
            color: '#fff',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          title="Underline"
        >
          U
        </button>
        <div style={{ width: '1px', backgroundColor: '#333', margin: '0 0.25rem' }} />
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h2>')}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #333',
            borderRadius: '4px',
            backgroundColor: '#262626',
            color: '#fff',
            cursor: 'pointer'
          }}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h3>')}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #333',
            borderRadius: '4px',
            backgroundColor: '#262626',
            color: '#fff',
            cursor: 'pointer'
          }}
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<p>')}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #333',
            borderRadius: '4px',
            backgroundColor: '#262626',
            color: '#fff',
            cursor: 'pointer'
          }}
          title="Paragraph"
        >
          P
        </button>
        <div style={{ width: '1px', backgroundColor: '#333', margin: '0 0.25rem' }} />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #333',
            borderRadius: '4px',
            backgroundColor: '#262626',
            color: '#fff',
            cursor: 'pointer'
          }}
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #333',
            borderRadius: '4px',
            backgroundColor: '#262626',
            color: '#fff',
            cursor: 'pointer'
          }}
          title="Numbered List"
        >
          1.
        </button>
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          minHeight: '200px',
          padding: '1rem',
          outline: 'none',
          color: '#fff',
          lineHeight: '1.6'
        }}
        data-placeholder={placeholder}
      />
    </div>
  )
}
