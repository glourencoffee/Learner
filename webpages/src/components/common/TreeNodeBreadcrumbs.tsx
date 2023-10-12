import { Breadcrumbs, BreadcrumbsProps, Link } from '@mui/material';
import { nanoid } from 'nanoid';
import { TreeNode } from '../../models';

interface NodeLink {
  name: string;
  url: string;
}

export interface TreeNodeBreadcrumbsProps extends BreadcrumbsProps {
  /**
   * A node which defines the last element in the breadcrumbs.
   */
  node: TreeNode;

  /**
   * A function which returns the URL associated with a node.
   * 
   * @param node A tree node.
   * @returns An URL.
   */
  getUrl: (node: TreeNode) => string;
}

/**
 * Renders a MUI `<Breadcrumbs>` for a `TreeNode`.
 * 
 * This component takes two mandatory props:
 * - `props.node`, a `TreeNode` which defines the last link of the breadcrumbs, and
 * - `props.getUrl`, a function which is used to obtain the URL from a node.
 * 
 * For each parent node in `props.node` hierarchy, creates a MUI `<Link>`
 * and uses it as a breadcrumbs element.
 * 
 * @param props The properties of this component.
 */
export default function TreeNodeBreadcrumbs({
  node,
  getUrl,
  ...props
}: TreeNodeBreadcrumbsProps): JSX.Element {
  
  let current = node;
  const links = new Array<NodeLink>();

  while (!current.isRoot()) {
    const parent = current.getParent();

    if (parent === null) {
      break;
    }

    links.unshift({
      name: current.toString(),
      url: getUrl(current)
    });

    current = parent;
  }

  const linkElements = links.map(
    (link) => (
      <Link
        key={nanoid()}
        underline='hover'
        color='inherit'
        href={link.url}
        target='_blank'
        rel='noopener noreferrer'
      >
        {link.name}
      </Link>
    )
  );

  return (
    <Breadcrumbs {...props}>
      {linkElements}
    </Breadcrumbs>
  );
}