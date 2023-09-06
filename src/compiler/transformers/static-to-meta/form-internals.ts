import ts from 'typescript';

import { getStaticValue } from '../transform-utils';

/**
 * Parse the form internals from a transformed Stencil compoment
 *
 * @param staticMembers
 */
export const parseFormInternals = (staticMembers: ts.ClassElement[]): string | null => {
  const parsedFormInternalsPropName = getStaticValue(staticMembers, 'formInternalsProp');
  if (parsedFormInternalsPropName) {
    return parsedFormInternalsPropName;
  } else {
    return null;
  }
};
