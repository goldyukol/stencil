import { ComponentCompilerMeta } from '@stencil/core/declarations';
import ts from 'typescript';

import { getStaticValue } from '../transform-utils';

/**
 * Parse whether a transformed Stencil component is form-associated
 *
 * @param staticMembers class members for the Stencil component of interest
 * @returns whether or not the given component is form-associated
 */
const parseFormAssociated = (staticMembers: ts.ClassElement[]): boolean => {
  const isFormAssociated = getStaticValue(staticMembers, 'formAssociated');
  return typeof isFormAssociated === "boolean" && isFormAssociated;
};

/**
 * Parse the name of  form internals prop from a transformed Stencil component
 * if present
 *
 * @param staticMembers class members for the Stencil component of interest
 * @returns the parsed value, if present, else null
 */
const parseFormInternals = (staticMembers: ts.ClassElement[]): string | null => {
  const parsedFormInternalsPropName = getStaticValue(staticMembers, 'formInternalsMemberName');
  if (parsedFormInternalsPropName && typeof parsedFormInternalsPropName === "string") {
    return parsedFormInternalsPropName;
  } else {
    return null;
  }
};

type FormAssociatedProperties = Pick<ComponentCompilerMeta, 'formAssociated' | 'formInternalsMemberName'>;

/**
 * Parse both of the static properties for form associated custom elements,
 * `formAssociated` and `formInternalsProp`, and return suitable values. In
 * particular, if `formAssociated` is not set to `true` in the `@Component`
 * decorator we should always return `null` for `formInternalsProp`.
 *
 * @param staticMembers class members for the Stencil component of interest
 * @returns an object with `formAssociated` and `formInternalsProp` set on
 * it
 */
export const parseFormAssociatedProperties = (staticMembers: ts.ClassElement[]): FormAssociatedProperties => {
  const formAssociated = parseFormAssociated(staticMembers);
  const formInternalsMemberName = parseFormInternals(staticMembers);

  if (formAssociated) {
    return { formAssociated, formInternalsMemberName };
  } else {
    return {
      formAssociated: false,
      formInternalsMemberName,
    };
  }
};
