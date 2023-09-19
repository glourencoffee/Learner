import { Chip } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { CodeProps } from 'react-markdown/lib/ast-to-react';
import { CodeBlock, monoBlue } from 'react-code-blocks';

// The code theme used by both single-line and multi-line code.
const codeTheme = monoBlue;

/**
 * Renders a MUI monospace `<Chip>` for Markdown code.
 * 
 * @param text The text in a Markdown code.
 */
function renderSingleLineCode(text: string): JSX.Element {
  return (
    <Chip
      component='span' // Must be a <span>, because Markdown code is rendered as a <p>.
                       // Since a MUI <Chip> is a <div> by default, the browser will
                       // complain that a <div> cannot be a child of <p>.
      variant='monospaced'
      size='small'
      label={text}
      sx={{
        borderRadius: '8px',
        color: codeTheme.codeColor,
        backgroundColor: codeTheme.backgroundColor,
        fontSize: '14px',
      }}
    />
  );
}

/**
 * Renders a syntax-highlighted code block with row numbering.
 * 
 * @param text The text in a Markdown code block.
 * @param language The language, as specified in the Markdown (e.g. `js`).
 */
function renderMultiLineCode(text: string, language?: string): JSX.Element {
  return (
    <CodeBlock
      theme={codeTheme}
      text={text}
      language={language}
      customStyle={{
        borderRadius: '8px'
      }}
    />
  );
}

function renderCode(props: CodeProps): JSX.Element {
  const texts = props.children as string[];
  const text  = texts[0];

  const isMultiLine = text.includes('\n');

  if (isMultiLine) {
    /**
     * When a multi-line Markdown has a language defined, the `className` prop
     * will be a string with format `"language-<lang>"`, where `<lang>` is the
     * string defined in the Markdown code. For example, the following Markdown code:
     * 
     * ```js
     * let example = 'This is Markdown';
     * ```
     * 
     * results in a `className` with value `"language-js"`.
     */
    const className = props.className?.split('-')[1];

    /**
     * For some reason, when a multi-line text is received from `<ReactMarkdown>`,
     * the last character is an extra new line (NL) character, even if the Markdown
     * text doesn't end with a NL. (Actually, when the Markdown itself ends with
     * a NL, two NL characters are received.) So, remove the extra NL character.
     */
    const normalizedText = (
      text.endsWith('\n')
      ? text.slice(0, -1)
      : text
    );

    return renderMultiLineCode(normalizedText, className);
  }
  else {
    return renderSingleLineCode(text)
  }
}

export interface MarkdownProps {
  /**
   * The text of the Markdown.
   */
  children: string;
}

/**
 * Renders Markdown with code highlighting and language detection.
 * 
 * @param props The properties of this component.
 */
export default function Markdown({ children }: MarkdownProps): JSX.Element {
  return (
    <ReactMarkdown
      components={{
        code: renderCode
      }}
    >
      {children}
    </ReactMarkdown>
  );
}