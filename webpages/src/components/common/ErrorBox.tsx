import {
  Divider,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { Property } from 'csstype';
import { nanoid } from 'nanoid';
import inspect from 'browser-util-inspect';

export interface ErrorBoxProps {
  /**
   * An error.
   */
  error: unknown | Error;

  /**
   * The gap between error sections.
   * 
   * @default '1em'
   */
  gap?: Property.Gap;

  /**
   * The padding around the error box.
   * 
   * @default '1em'
   */
  padding?: Property.Padding;

  /**
   * The background color of the error box.
   * 
   * @default 'error.light'
   */
  backgroundColor?: Property.BackgroundColor;

  /**
   * Section options.
   * 
   * @default {}
   */
  section?: {
    
    /**
     * The color of a section's title text.
     * 
     * @default 'common.white'
     */
    titleColor?: Property.Color;
  };
}

/**
 * Renders a box that contains details of `props.error`.
 * 
 * @param props The properties of this component.
 */
export default function ErrorBox(props: ErrorBoxProps): JSX.Element {
  const { error } = props;

  const gap               = props.gap ?? '1em';
  const padding           = props.padding ?? '1em';
  const backgroundColor   = props.backgroundColor ?? 'error.light';
  const sectionTitleColor = props.section?.titleColor ?? 'common.white';

  // Renders a section of this error box.
  function Section({ title, children }: React.PropsWithChildren<
    { title: string }
  >): JSX.Element {

    return (
      <Stack>
        <Typography
          variant='body1'
          color={sectionTitleColor}
          gutterBottom
        >
          {title}
        </Typography>
        <Paper
          elevation={3}
          sx={{
            padding: '1em',
            overflow: 'auto'
          }}
        >
          {children}
        </Paper>
      </Stack>
    );
  }

  const sections = [];

  //=================
  // Message section
  //=================
  if (error instanceof Error) {
    sections.push(
      <Section
        key={nanoid()}
        title='Message:'
      >
        <Typography overflow='visible'>
          {error.message}
        </Typography>
      </Section>
    );
  }

  //=================
  // Content section
  //=================
  if (error instanceof Object) {
    const propertyElements = new Array<React.ReactNode>();

    for (const [key, value] of Object.entries(error)) {
      const keySpan = (
        <span
          style={{
            color: '#9c1967',
            fontWeight: 'bold'
          }}
        >
          {key}
        </span>
      );

      const valueSpan = (
        <span
          style={{
            color: '#444'
          }}
        >
          { inspect(value, { showHidden: false, depth: 4 }) }
        </span>
      );
      
      propertyElements.push(
        <Typography
          key={nanoid()}
          fontFamily='monospace'
          noWrap
          overflow='visible'
        >
          {keySpan}: {valueSpan}
        </Typography>
      );
    }

    if (propertyElements.length > 0) {
      sections.push(
        <Section
          key={nanoid()}
          title='Content:'
        >
          {propertyElements}
        </Section>
      );
    }
  }
  else {
    sections.push(
      <Section
        key={nanoid()}
        title='Content:'
      >
        <Typography
          fontFamily='monospace'
          noWrap
          overflow='visible'
        >
          {String(error)}
        </Typography>
      </Section>
    );
  }
  
  //=====================
  // Stack trace section
  //=====================
  if (error instanceof Error && error.stack) {
    sections.push(
      <Section
        key={nanoid()}
        title='Trace:'
      >
        <Typography
          fontFamily='monospace'
          whiteSpace='pre'
          overflow='visible'
        >
          {error.stack}
        </Typography>
      </Section>
    );
  }

  const sectionsWithDivider = [];

  for (const [index, section] of sections.entries()) {
    sectionsWithDivider.push(section);

    if (index < (sections.length - 1)) {
      sectionsWithDivider.push(<Divider key={nanoid()} />);
    }
  }

  return (
    <Stack
      id='error-box'
      flexGrow={1}
      padding={padding}
      gap={gap}
      sx={{
        backgroundColor
      }}
    >
      {sectionsWithDivider}
    </Stack>
  );
}