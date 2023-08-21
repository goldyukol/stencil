import { buildError } from '@utils';
import ts from 'typescript';
import type * as d from '../../../declarations';
import { createStaticGetter, retrieveTsDecorators, tsPropDeclNameAsString } from '../transform-utils';
import { isDecoratorNamed, updateConstructor } from './decorator-utils';

/**
 * Convert the form internals decorator to the static code which implements its
 * documented behavior.
 *
 * The `@FormInternals` decorator is used to indicate a field on a class where
 * the return value of the `HTMLElement.attachInternals` method should be bound.
 * This then allows component authors to use that interface to make their
 * Stencil components rich participants in whatever `HTMLFormElement` instances
 * they find themselves inside in the future.
 *
 * **Note**: this function does not validate that the `formAssociated` option
 * was set in the `@Component` decorator.
 *
 */
export const formInternalsDecoratorsToStatic = (
  diagnostics: d.Diagnostic[],
  classNode: ts.ClassDeclaration,
  decoratedMembers: ts.ClassElement[],
  newMembers: ts.ClassElement[],
) => {
  const formInternalsMembers = decoratedMembers
    .filter(ts.isPropertyDeclaration)
    .filter(ts.isPropertyDeclaration)
    .filter((prop) => {
      return !!retrieveTsDecorators(prop)?.find(isDecoratorNamed('FormInternals'));
    });

  // no decorator fields, return!
  // TODO print a warning if the component was form-associated but no decorator
  // was found?
  if (formInternalsMembers.length === 0) {
    return newMembers;
  }

  // found too many!
  if (formInternalsMembers.length > 1) {
    const error = buildError(diagnostics);
    error.messageText = `Stencil does not support adding more than one FormAssociated() decorator to a component`;
  }

  const [decoratedProp] = formInternalsMembers;

  const name = tsPropDeclNameAsString(decoratedProp);

  const newCtorStatements = [
    ts.factory.createExpressionStatement(
      ts.factory.createBinaryExpression(
        ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier(name)),
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

  return updateConstructor(classNode, newMembers, newCtorStatements);
};
