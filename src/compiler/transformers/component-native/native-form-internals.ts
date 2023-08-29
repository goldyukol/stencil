import ts from 'typescript';

import type * as d from '../../../declarations';

/**
 * TODO JSDoc
 * @param cmp
 */
export function addFormInternalsBinding(cmp: d.ComponentCompilerMeta): ts.ExpressionStatement[] {
  if (cmp.formInternalsProp) {
    return [
      ts.factory.createExpressionStatement(
        ts.factory.createBinaryExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createThis(),
            ts.factory.createIdentifier(cmp.formInternalsProp),
          ),
          ts.factory.createToken(ts.SyntaxKind.EqualsToken),
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createThis(),
              ts.factory.createIdentifier('attachInternals'),
            ),
            undefined,
            [],
          ),
        ),
      ),
    ];
  } else {
    return [];
  }
}
