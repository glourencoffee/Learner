import { Link, Stack } from "@mui/material";
import { nanoid } from "nanoid";

interface NavigationLink {
  readonly title: string;
  readonly path: string;
}

const navLinks = [
  {
    title: 'Questions',
    path: '/questions'
  },
  {
    title: 'Statistics',
    path: '/stats'
  },
  {
    title: 'Knowledge Areas',
    path: '/knowledgeareas'
  }
];

function NavigationItem({ title, path }: NavigationLink): JSX.Element {
  return (
    <Link
      variant='h6'
      color='common.white'
      noWrap
      href={path}
      underline='hover'
      textOverflow='ellipsis'
    >
      {title}
    </Link>
  );
}

export default function Navigation(): JSX.Element {
  const items = navLinks.map(link => <NavigationItem key={nanoid()} {...link} />);

  return (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='flex-end'
      spacing='1em'
    >
      {items}
    </Stack>
  );
}