import { buildError } from '@utils';
import ts from 'typescript';

import type * as d from '../../../declarations';
import { FORM_INTERNALS_STATIC_PROP_NAME } from '../constants';
import {
  convertValueToLiteral,
  createStaticGetter,
  retrieveTsDecorators,
  tsPropDeclNameAsString,
} from '../transform-utils';
import { isDecoratorNamed, updateConstructor } from './decorator-utils';

/**
 * Convert the form internals decorator to static, saving the name of the decorated
 * property so an `ElementInternals` object can be bound to it later on.
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
 * Additionally, this function will mutate the `newMembers` parameter in
 * order to add new members to the class.
 *
 * @param diagnostics for reporting errors and warnings
 * @param classNode the class node of interest
 * @param decoratedMembers the decorated members found on the class
 * @param newMembers an out param for new class members
 */
export const formInternalsDecoratorsToStatic = (
  diagnostics: d.Diagnostic[],
  classNode: ts.ClassDeclaration,
  decoratedMembers: ts.ClassElement[],
  newMembers: ts.ClassElement[],
) => {
  const formInternalsMembers = decoratedMembers.filter(ts.isPropertyDeclaration).filter((prop) => {
    return !!retrieveTsDecorators(prop)?.find(isDecoratorNamed('FormInternals'));
  });

  // no decorator fields, return!
  // TODO print a warning if the component was form-associated but no decorator
  // was found?
  if (formInternalsMembers.length === 0) {
    return;
  }

  // found too many!
  if (formInternalsMembers.length > 1) {
    const error = buildError(diagnostics);
    error.messageText = `Stencil does not support adding more than one FormAssociated() decorator to a component`;
  }

  const [decoratedProp] = formInternalsMembers;

  const name = tsPropDeclNameAsString(decoratedProp);

  newMembers.push(createStaticGetter(FORM_INTERNALS_STATIC_PROP_NAME, convertValueToLiteral(name)));

  // const newCtorStatements = [
  //   ts.factory.createExpressionStatement(
  //     ts.factory.createBinaryExpression(
  //       ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier(name)),
  //       ts.factory.createToken(ts.SyntaxKind.EqualsToken),
  //       ts.factory.createCallExpression(
  //         ts.factory.createPropertyAccessExpression(
  //           ts.factory.createThis(),
  //           ts.factory.createIdentifier('attachInternals'),
  //         ),
  //         undefined,
  //         [],
  //       ),
  //     ),
  //   ),
  // ];

  // return updateConstructor(classNode, newMembers, newCtorStatements);
};
