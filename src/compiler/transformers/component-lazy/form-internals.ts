import ts from 'typescript';

import type * as d from '@stencil/core/declarations';

/**
 * When standing up a lazy-loaded form-associated custom element we need
 * TODO explain why pull off of hostRef
 * @param cmp
 */
export function createLazyFormInternalsBinding(cmp: d.ComponentCompilerMeta): ts.ExpressionStatement[] {
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
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier('hostRef'),
                ts.factory.createIdentifier('$hostElement$'),
              ),
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
