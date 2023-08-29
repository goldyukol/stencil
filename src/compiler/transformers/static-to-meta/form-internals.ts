import ts from 'typescript';
import { FORM_INTERNALS_STATIC_PROP_NAME } from '../constants';

import { getStaticValue } from '../transform-utils';

/**
 * Parse the form internals from a transformed Stencil compoment
 *
 */
export const parseFormInternals = (staticMembers: ts.ClassElement[]): string | null => {
  const parsedFormInternalsPropName = getStaticValue(staticMembers, FORM_INTERNALS_STATIC_PROP_NAME);
  if (parsedFormInternalsPropName) {
    return parsedFormInternalsPropName;
  } else {
    return null;
  }
};
