import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Slide,
  Stack
} from '@mui/material';
import { Close } from '@mui/icons-material';
import {
  Form as FormikForm,
  FormikProvider,
  FormikValues,
  useFormik
} from 'formik';
import ProgressBackdrop from './ProgressBackdrop';
import ErrorAlert from './ErrorAlert';
import { TransitionGroup } from 'react-transition-group';
import { nanoid } from 'nanoid';

const DEFAULT_ALERT_DURATION = 30000;

interface AlertActionProps {
  node?: React.ReactNode;
  closeable?: boolean;
  onClose?: () => void;
}

function AlertAction({
  node,
  closeable,
  onClose,
}: AlertActionProps): JSX.Element | null {
  let closeButton;

  if (closeable) {
    closeButton = (
      <IconButton
        color='inherit'
        onClick={onClose}
      >
        <Close
          fontSize='small'
          color='inherit'
        />
      </IconButton>
    );
  }
  else if (node === undefined) {
    // If there is no close button nor a custom action,
    // then there is no action at all.
    return null;
  }

  return (
    <Stack direction='row'>
      {node}
      {closeButton}      
    </Stack>
  );
}


/**
 * Properties related to Material UI `<Alert>` used by `<Form>`.
 */
export interface FormAlertProps<T> {
  /**
   * Whether the alert has a close button which allows
   * the user to close it.
   * 
   * @default false
   */
  closable?: boolean;

  /**
   * A duration in milliseconds for how long the alert
   * remains on screen.
   * 
   * @default 30000
   */
  duration?: number;

  /**
   * A callback function that returns the text or element
   * to be rendered when the alert is shown. This will be
   * the main content of the alert.
   * 
   * @param value The result of the submit action or an error.
   * @returns A string or element.
   */
  renderText?: (value: T) => React.ReactNode | string;

  /**
   * A callback function that returns the element to be
   * used as action of the alert.
   * 
   * @param value The result of the submit action or an error.
   * @returns A string or element.
   */
  renderAction?: (value: T) => React.ReactNode;
}

export interface FormProps<Values extends FormikValues, SubmitResult> {
  /**
   * The initial values of the form.
   */
  initialValues: Values;

  /**
   * A callback function to validate the form's values.
   * 
   * @param values The current values in the form.
   * @returns An error object or nothing, if form values are valid.
   * @default undefined
   */
  validate?: (values: Values) => void | object;

  /**
   * The text of the submit button.
   * 
   * Only applicable if the prop `renderSubmit` is `undefined`.
   * 
   * @default 'Submit'
   */
  buttonText?: string;

  /**
   * The title of the submit button.
   * 
   * Only applicable if the prop `renderSubmit` is `undefined`.
   * 
   * @default undefined
   */
  buttonTitle?: string;

  /**
   * Defines whether to show alerts.
   * 
   * If `'success'`, shows alerts only on success.
   * 
   * If `'failure'`, shows alerts only on failure.
   * 
   * If `'yes'`, shows alerts both on success and on failure.
   * 
   * If `'no'`, shows no alerts.
   * 
   * @default 'yes'
   */
  showAlert?: 'success' | 'failure' | 'yes' | 'no';

  /**
   * Options for alert on success.
   * 
   * @default { renderText: 'Success!' }
   */
  successAlert?: FormAlertProps<SubmitResult>;

  /**
   * Options for alert on success.
   * 
   * @default {}
   */
  failureAlert?: Omit<FormAlertProps<unknown | Error>, 'renderText'>;

  /**
   * A callback function to render the submit area of this form.
   * 
   * If `undefined`, renders a MUI `<Button>` of type `'submit'` with
   * `buttonText` and `buttonTitle` for the button's text and title,
   * respectively.
   * 
   * @returns A submit element.
   * @default undefined
   */
  renderSubmit?: () => React.ReactElement;

  /**
   * A callback function called to perform a form-specific submit action,
   * which is usually a POST or a PUT request.
   * 
   * This function is called when the submit button is triggered,
   * and its result `r` is forwarded to alert options, depending on
   * the state of the promise:
   * - If the promise is *fulfilled*, invokes `successAlert.renderText(r)`
   *   and `successAlert.renderAction(r)`
   * - If the promise is *rejected*, invokes `failureAlert.renderAction(r)`.
   *
   * @returns A value or a promise.
   * @default undefined
   */
  onSubmit?: (values: Values) => SubmitResult | Promise<SubmitResult>;
}

enum SubmitStatus {
  UNSUBMITTED,
  PENDING,
  SUCCEEDED,
  FAILED
}

interface FormState<SubmitResult> {
  submitStatus: SubmitStatus;
  submitResult?: SubmitResult | unknown;
}

/**
 * Renders a form with validation, alert, and progress tracking capabilities.
 * 
 * This component implements a Formik `<Form>`, allowing for inline validation.
 * Besides, it can show alerts and a `<ProgressBackdrop>` to give feedback from
 * a submit action.
 * 
 * If `props.onSubmit` is not `undefined`, behaves as follows when the submit button
 * is clicked:
 * - Renders `<ProgressBackdrop>` and calls `props.onSubmit()`, waiting for the state
 *   of the promise to change.
 * - If the promise is fulfilled and `props.showAlert` is `'success'` or `'yes'`,
 *   renders a Material UI `<Alert>` with `severity='success'`. The action of this
 *   alert may be customized with `props.successAlert`.
 * - If the promise is rejected and `props.showAlert` is `'failure'` or `'yes'`,
 *   renders an `<ErrorAlert>`. The action of this alert may be customized with
 *   `props.failureAlert`.
 * 
 * @param props The properties of this component.
 * @see `<ProgressBackdrop>`
 * @see `<ErrorAlert>`
 */
export default function Form<
  Values extends FormikValues,
  SubmitResult
>(props: React.PropsWithChildren<FormProps<Values, SubmitResult>>): JSX.Element {

  //========================
  // Tracking submit status
  //========================
  const [state, setState] = useState<FormState<SubmitResult>>({
    submitStatus: SubmitStatus.UNSUBMITTED
  });

  //======================================================
  // Showing alert if enabled, depending on submit status
  //======================================================
  const showAlert = props.showAlert ?? 'yes';
  let alertElement;
  let alertDuration;

  // If either of the alerts is closable, this function is
  // called when the close button is clicked.
  function handleAlertClose(): void {
    setState({ submitStatus: SubmitStatus.UNSUBMITTED });
  }

  if ((state.submitStatus === SubmitStatus.SUCCEEDED) &&
      (showAlert === 'success' || showAlert === 'yes'))
  {
    const value = state.submitResult as SubmitResult;
    const { successAlert } = props;

    let closable;
    let alertText;
    let actionNode;
    
    if (successAlert !== undefined) {
      closable   = successAlert.closable;
      actionNode = successAlert.renderAction?.(value)
      alertText  = successAlert.renderText?.(value);
    }

    alertElement = (
      <Alert
        severity='success'
        action={
          <AlertAction
            node={actionNode}
            closeable={closable}
            onClose={handleAlertClose}
          />
        }
      >
        {alertText ?? 'Success!'}
      </Alert>
    );

    alertDuration = successAlert?.duration ?? DEFAULT_ALERT_DURATION;
  }
  else if ((state.submitStatus === SubmitStatus.FAILED) &&
           (showAlert === 'failure' || showAlert === 'yes'))
  {
    const error = state.submitResult;
    const { failureAlert } = props;

    let closable;
    let actionNode;
    
    if (failureAlert !== undefined) {
      closable   = failureAlert.closable;
      actionNode = failureAlert.renderAction?.(error)
    }
    failureAlert?.renderAction?.(error)

    alertElement = (
      <ErrorAlert
        error={error}
        action={
          <AlertAction
            node={actionNode}
            closeable={closable}
            onClose={handleAlertClose}
          />}
      />
    );

    alertDuration = failureAlert?.duration ?? DEFAULT_ALERT_DURATION;
  }

  if (alertDuration) {
    // `alertDuration` is defined if the submit status changed to either
    // SUCCEEDED or FAILED, and the client wants to see an alert.
    // Now, change the status to UNSUBMITTED after `alertDuration`
    // milliseconds, so that the client will stop seeing the alert.
    setTimeout(
      () => setState({ submitStatus: SubmitStatus.UNSUBMITTED }),
      alertDuration
    );
  }
  else if ([SubmitStatus.SUCCEEDED, SubmitStatus.FAILED].includes(state.submitStatus)) {
    // The submit status changed to SUCCEEDED or FAILED, but the client
    // doesn't want to see any alerts, in which case there is no need
    // for setting a timeout. Change the state right now.
    setState({ submitStatus: SubmitStatus.UNSUBMITTED });
  }

  //===============================================
  // Applying a transition to alert for smoothness
  //===============================================
  let alertTransition;

  if (alertElement !== undefined) {    
    alertTransition = (
      <TransitionGroup>
        <Slide
          key={nanoid()}
          direction='down'
          timeout={{
            enter: 400,
            exit: 1000
          }}
        >
          <Box>
            {alertElement}
          </Box>
        </Slide>
      </TransitionGroup>
    );
  }
  else {
    alertTransition = <TransitionGroup />;
  }

  //==================================
  // Handling change of submit status
  //==================================
  async function handleSubmit(values: Values): Promise<void> {
    // If undefined, don't change status.
    if (props.onSubmit === undefined)
      return;
      
    setState({
      submitStatus: SubmitStatus.PENDING,
    })
    
    try {
      const result = await props.onSubmit(values);

      setState({
        submitStatus: SubmitStatus.SUCCEEDED,
        submitResult: result
      });
    }
    catch (e) {
      setState({
        submitStatus: SubmitStatus.FAILED,
        submitResult: e
      });
    }
  }
  
  const formik = useFormik({
    initialValues: props.initialValues,
    validate: props.validate,
    onSubmit: handleSubmit,

    validateOnChange: true,

    /**
     * Disable validation on blur events.
     * 
     * Enabling onBlur validation causes an incorrect behavior when
     * there are multiple validatable fields in a form and one of
     * them is changed before the other loses focus. This happens
     * becauses onChange is called before onBlur.
     * 
     * For example, say there are two fields in a form, F1 and F2.
     * Both of them are validatable, that is, their data is used
     * in the same `props.validate` function. F1 is a normal input
     * field, and F2 is a select field with a tool button on the right,
     * which when pressed, clears the content of F2.
     * 
     * Say the user selects an option on F2. Then, it types a text
     * on F1, which, combined with the option selected in F2, is
     * considered invalid (`props.validate()` returns an error for
     * that data combination). An error feedback is shown to the user.
     * 
     * The user then decides to clear F2, clicking on the tool button.
     * The following will happen, in that order:
     * - F2.onChange() is called, which in turn calls `props.validate()`
     *   with the new data (F1 with the typed input and F2 cleared).
     * - F1.onBlur() is called, which in turn calls `props.validate()`
     *   with the old data (F1 with the typed input and F2 with the
     *   previously selected option).
     * 
     * The effect is that even if the first call (F2.onChange()) results
     * in data being validated as correct, F1.onBlur() will "override"
     * this verdict and consider it as invalid, since it is based on
     * the previous state.
     * 
     * The ideal behavior would be to call F1.onBlur() before F2.onChange(),
     * but since this is not what happens, disable onBlur validation.
     * 
     * Moreover, this form uses inline validation (`validateOnChange: true`),
     * so there is no need for onBlur validation anyways.
     */
    validateOnBlur: false
  });

  let submitElement;

  if (props.renderSubmit) {
    submitElement = props.renderSubmit();
  }
  else {
    submitElement = (
      <Button
        type='submit'
        title={props.buttonTitle}
        sx={{
          alignSelf: 'center'
        }}
      >
        {props.buttonText ?? 'Submit'}
      </Button>
    );
  }

  //===========
  // Rendering
  //===========
  return (
    <Stack>
      <ProgressBackdrop open={(state.submitStatus === SubmitStatus.PENDING)} />
      {alertTransition}
      <FormikProvider value={formik}>
        <FormikForm>
          <Stack
            padding='2em'
            gap='1em'
          >
            {props.children}
            {submitElement}
          </Stack>
        </FormikForm>
      </FormikProvider>
    </Stack>
  );
}