import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { Bold,Italic,Heading2,List,Quote,Code,Undo,Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function RichTextEditor({value,onChange}:{value:string;onChange:(value:string)=>void}) {
 const editor=useEditor({extensions:[StarterKit,Markdown],content:value,contentType:'markdown',immediatelyRender:false,onUpdate:({editor})=>onChange(editor.getMarkdown()),editorProps:{attributes:{class:'article-body min-h-96 p-4 outline-none','aria-label':'Article body'}}});
 useEffect(()=>{if(editor && editor.getMarkdown()!==value) editor.commands.setContent(value,{contentType:'markdown',emitUpdate:false});},[editor,value]);
 if(!editor) return <div className="h-96 bg-muted" aria-busy="true" />;
 const tools=[
  {title:'Bold',icon:Bold,run:()=>editor.chain().focus().toggleBold().run()},
  {title:'Italic',icon:Italic,run:()=>editor.chain().focus().toggleItalic().run()},
  {title:'Heading',icon:Heading2,run:()=>editor.chain().focus().toggleHeading({level:2}).run()},
  {title:'Bullet list',icon:List,run:()=>editor.chain().focus().toggleBulletList().run()},
  {title:'Quote',icon:Quote,run:()=>editor.chain().focus().toggleBlockquote().run()},
  {title:'Code block',icon:Code,run:()=>editor.chain().focus().toggleCodeBlock().run()},
  {title:'Undo',icon:Undo,run:()=>editor.chain().focus().undo().run()},
  {title:'Redo',icon:Redo,run:()=>editor.chain().focus().redo().run()},
 ];
 return <div className="overflow-hidden rounded-lg border border-border bg-card"><div className="flex flex-wrap gap-1 border-b border-border p-2">{tools.map(tool=><Button key={tool.title} type="button" variant="ghost" size="icon" title={tool.title} aria-label={tool.title} onClick={tool.run}><tool.icon className="h-5 w-5" /></Button>)}</div><EditorContent editor={editor} /></div>;
}
