import ts from 'typescript';

import type * as d from '@stencil/core/declarations';

/**
 * TODO JSDoc
 * @param cmp
 */
export function createNativeFormInternalsBinding(cmp: d.ComponentCompilerMeta): ts.ExpressionStatement[] {
  if (cmp.formAssociated && cmp.formInternalsProp) {
    return [
      ts.factory.createExpressionStatement(
        ts.factory.createBinaryExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createThis(),
            // use the name set on the {@link d.ComponentCompilerMeta}
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
