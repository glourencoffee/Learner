import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

type HTMLAnchorElementProps = Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] };

// https://mui.com/material-ui/guides/routing/
function render(props: HTMLAnchorElementProps, ref: React.ForwardedRef<HTMLAnchorElement>) {
  const { href, ...other } = props;

  // Map href (Material UI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
}

const LinkBehavior = React.forwardRef(render);

export default LinkBehavior;