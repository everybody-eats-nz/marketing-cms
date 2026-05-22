import React from 'react'

type LexicalNode = any

/**
 * Minimal Lexical → JSX renderer that covers what our seed produces:
 * roots, paragraphs, headings, lists, links, and text formatting.
 */
export function RichText({ content, className = '' }: { content: any; className?: string }) {
  if (!content?.root?.children) return null
  return (
    <div className={`prose-eats ${className}`}>
      {content.root.children.map((node: LexicalNode, i: number) => (
        <NodeView key={i} node={node} />
      ))}
    </div>
  )
}

function NodeView({ node }: { node: LexicalNode }) {
  if (!node) return null

  if (node.type === 'paragraph') {
    if (!node.children?.length) return <p>&nbsp;</p>
    return (
      <p>
        {node.children.map((c: LexicalNode, i: number) => (
          <Inline key={i} node={c} />
        ))}
      </p>
    )
  }

  if (node.type === 'heading') {
    const Tag = (node.tag as keyof React.JSX.IntrinsicElements) || 'h2'
    return (
      <Tag>
        {node.children?.map((c: LexicalNode, i: number) => (
          <Inline key={i} node={c} />
        ))}
      </Tag>
    )
  }

  if (node.type === 'list') {
    const ListTag = node.listType === 'number' ? 'ol' : 'ul'
    return (
      <ListTag>
        {node.children?.map((li: LexicalNode, i: number) => (
          <li key={i}>
            {li.children?.map((c: LexicalNode, j: number) => (
              <Inline key={j} node={c} />
            ))}
          </li>
        ))}
      </ListTag>
    )
  }

  if (node.type === 'quote') {
    return (
      <blockquote>
        {node.children?.map((c: LexicalNode, i: number) => (
          <Inline key={i} node={c} />
        ))}
      </blockquote>
    )
  }

  if (node.type === 'horizontalrule') {
    return <hr />
  }

  // Fallback — render children
  if (node.children?.length) {
    return (
      <>
        {node.children.map((c: LexicalNode, i: number) => (
          <NodeView key={i} node={c} />
        ))}
      </>
    )
  }

  return null
}

function Inline({ node }: { node: LexicalNode }) {
  if (!node) return null

  if (node.type === 'linebreak') return <br />

  if (node.type === 'link') {
    const url = node.fields?.url || node.url || '#'
    const newTab = node.fields?.newTab
    return (
      <a href={url} target={newTab ? '_blank' : undefined} rel={newTab ? 'noreferrer' : undefined}>
        {node.children?.map((c: LexicalNode, i: number) => (
          <Inline key={i} node={c} />
        ))}
      </a>
    )
  }

  if (node.type === 'text') {
    let content: React.ReactNode = node.text
    const format = node.format || 0
    // Lexical text format bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code, 32=subscript, 64=superscript
    if (format & 1) content = <strong>{content}</strong>
    if (format & 2) content = <em>{content}</em>
    if (format & 4) content = <s>{content}</s>
    if (format & 8) content = <u>{content}</u>
    if (format & 16) content = <code>{content}</code>
    return <>{content}</>
  }

  // Unknown inline — render children
  if (node.children?.length) {
    return (
      <>
        {node.children.map((c: LexicalNode, i: number) => (
          <Inline key={i} node={c} />
        ))}
      </>
    )
  }

  return null
}
