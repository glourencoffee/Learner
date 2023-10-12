import { Button, Stack } from '@mui/material';

export interface SuccessAlertActionProps {
  /**
   * A url to the view page.
   */
  viewUrl: string;

  /**
   * A url to the edit page.
   */
  editUrl?: string;
}

/**
 * Renders an action box with up to two buttons, one for redirecting to
 * a view page (`props.viewUrl`), and another for redirecting to an edit
 * page, if `props.editUrl` is not empty or `undefined`.
 * 
 * @param props The properties of this component.
 */
export default function SuccessAlertAction({
  viewUrl,
  editUrl
}: SuccessAlertActionProps): JSX.Element {
  let editButton;

  if (editUrl) {
    editButton = (
      <Button href={editUrl}>
        Edit
      </Button>
    );
  }

  return (
    <Stack direction='row'>
      <Button href={viewUrl}>
        View
      </Button>
      {editButton}
    </Stack>
  );
}