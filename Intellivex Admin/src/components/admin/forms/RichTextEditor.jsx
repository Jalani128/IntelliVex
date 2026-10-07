import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline,
  Undo2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/** TipTap's empty document serialises as `<p></p>` — treat that as no content. */
export const isEmptyHtml = (html = '') => !html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()

const toHtml = (editor) => (editor.isEmpty ? '' : editor.getHTML())

function ToolButton({ label, active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the text selection while clicking the toolbar.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        'grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4',
        active && 'bg-accent text-primary',
      )}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      link: e.isActive('link'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })

  const setLink = () => {
    const previous = editor.getAttributes('link').href ?? ''
    const url = window.prompt('Link URL (https://… or /page)', previous)
    if (url === null) return
    const href = url.trim()
    if (!href) return editor.chain().focus().extendMarkRange('link').unsetLink().run()
    // Only web links and site paths — no javascript: or data: URLs.
    if (!/^(https?:\/\/|\/|mailto:|tel:)/i.test(href)) {
      window.alert('Use a link that starts with https://, /, mailto: or tel:')
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
  }

  const chain = () => editor.chain().focus()

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 px-1.5 py-1" role="toolbar" aria-label="Formatting">
      <ToolButton label="Bold" active={state.bold} onClick={() => chain().toggleBold().run()}>
        <Bold />
      </ToolButton>
      <ToolButton label="Italic" active={state.italic} onClick={() => chain().toggleItalic().run()}>
        <Italic />
      </ToolButton>
      <ToolButton label="Underline" active={state.underline} onClick={() => chain().toggleUnderline().run()}>
        <Underline />
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-border" aria-hidden />
      <ToolButton label="Heading" active={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
        <Heading2 />
      </ToolButton>
      <ToolButton label="Subheading" active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
        <Heading3 />
      </ToolButton>
      <ToolButton label="Bulleted list" active={state.bullet} onClick={() => chain().toggleBulletList().run()}>
        <List />
      </ToolButton>
      <ToolButton label="Numbered list" active={state.ordered} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered />
      </ToolButton>
      <ToolButton label="Quote" active={state.quote} onClick={() => chain().toggleBlockquote().run()}>
        <Quote />
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-border" aria-hidden />
      <ToolButton label="Add link" active={state.link} onClick={setLink}>
        <Link2 />
      </ToolButton>
      <ToolButton label="Remove link" disabled={!state.link} onClick={() => chain().extendMarkRange('link').unsetLink().run()}>
        <Link2Off />
      </ToolButton>
      <span className="ml-auto" />
      <ToolButton label="Undo" disabled={!state.canUndo} onClick={() => chain().undo().run()}>
        <Undo2 />
      </ToolButton>
      <ToolButton label="Redo" disabled={!state.canRedo} onClick={() => chain().redo().run()}>
        <Redo2 />
      </ToolButton>
    </div>
  )
}

/**
 * Rich-text field that reads and writes an HTML string (`value` / `onChange`), for
 * react-hook-form. Output is limited to what StarterKit knows — paragraphs, h2/h3,
 * lists, quotes, bold / italic / underline and links — and the API sanitises it again.
 */
const RichTextEditor = forwardRef(function RichTextEditor(
  { value = '', onChange, onBlur, placeholder = 'Start writing…', minHeight = 180, className, id, ...aria },
  ref,
) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        code: false,
        horizontalRule: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https', HTMLAttributes: { rel: 'noopener noreferrer', target: null } },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'rich-text px-3 py-2.5 text-sm outline-none',
        style: `min-height:${minHeight}px`,
        'aria-multiline': 'true',
        role: 'textbox',
        ...(id && { id }),
        ...(aria['aria-invalid'] && { 'aria-invalid': 'true' }),
        ...(aria['aria-describedby'] && { 'aria-describedby': aria['aria-describedby'] }),
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor: e }) => onChange?.(toHtml(e)),
    onBlur: () => onBlur?.(),
  })

  // Let react-hook-form focus the editor on a validation error.
  useImperativeHandle(ref, () => ({ focus: () => editor?.commands.focus() }), [editor])

  // Follow outside changes (form reset, record loaded) without clobbering typing.
  useEffect(() => {
    if (!editor || value === toHtml(editor)) return
    editor.commands.setContent(value || '', { emitUpdate: false })
  }, [editor, value])

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 dark:bg-input/30',
        aria['aria-invalid'] && 'border-destructive',
        className,
      )}
    >
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
})

export default RichTextEditor
