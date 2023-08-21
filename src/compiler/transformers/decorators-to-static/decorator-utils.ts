import ts from 'typescript';

import { objectLiteralToObjectMap, retrieveTsModifiers } from '../transform-utils';
import type { StencilDecorator } from './decorators-constants';

export const getDecoratorParameters: GetDecoratorParameters = (
  decorator: ts.Decorator,
  typeChecker: ts.TypeChecker,
): any => {
  if (!ts.isCallExpression(decorator.expression)) {
    return [];
  }
  return decorator.expression.arguments.map((arg) => getDecoratorParameter(arg, typeChecker));
};

const getDecoratorParameter = (arg: ts.Expression, typeChecker: ts.TypeChecker): any => {
  if (ts.isObjectLiteralExpression(arg)) {
    return objectLiteralToObjectMap(arg);
  } else if (ts.isStringLiteral(arg)) {
    return arg.text;
  } else if (ts.isPropertyAccessExpression(arg) || ts.isIdentifier(arg)) {
    const type = typeChecker.getTypeAtLocation(arg);
    if (type !== undefined && type.isLiteral()) {
      /**
       * Using enums or variables require us to resolve the value for
       * the computed property/identifier via the TS type checker. As long
       * as the type resolves to a literal, we can grab its value to be used
       * as the `@Watch()` decorator argument.
       */
      return type.value;
    }
  }

  throw new Error(`invalid decorator argument: ${arg.getText()}`);
};

/**
 * Returns a function that checks if a decorator:
 * - is a call expression. these are decorators that are immediately followed by open/close parenthesis with optional
 *   arg(s), e.g. `@Prop()`
 * - the name of the decorator matches the provided `propName`
 *
 * @param propName the name of the decorator to match against
 * @returns true if the conditions above are both true, false otherwise
 */
export const isDecoratorNamed = (propName: StencilDecorator) => {
  return (dec: ts.Decorator): boolean => {
    return ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === propName;
  };
};

export interface GetDecoratorParameters {
  <T>(decorator: ts.Decorator, typeChecker: ts.TypeChecker): [T];
  <T, T1>(decorator: ts.Decorator, typeChecker: ts.TypeChecker): [T, T1];
  <T, T1, T2>(decorator: ts.Decorator, typeChecker: ts.TypeChecker): [T, T1, T2];
}

/**
 * Helper util for updating the constructor on a class declaration AST node.
 *
 * @param classNode the class node whose constructor will be updated
 * @param classMembers a list of class members for that class
 * @param statements a list of statements which should be added to the
 * constructor
 * @returns a list of updated class elements
 */
export const updateConstructor = (
  classNode: ts.ClassDeclaration,
  classMembers: ts.ClassElement[],
  statements: ts.Statement[],
): ts.ClassElement[] => {
  const constructorIndex = classMembers.findIndex((m) => m.kind === ts.SyntaxKind.Constructor);
  const constructorMethod = classMembers[constructorIndex];

  if (constructorIndex >= 0 && ts.isConstructorDeclaration(constructorMethod)) {
    const constructorBodyStatements: ts.NodeArray<ts.Statement> =
      constructorMethod.body?.statements ?? ts.factory.createNodeArray();
    const hasSuper = constructorBodyStatements.some((s) => s.kind === ts.SyntaxKind.SuperKeyword);

    if (!hasSuper && needsSuper(classNode)) {
      // if there is no super and it needs one the statements comprising the
      // body of the constructor should be:
      //
      // 1. the `super()` call
      // 2. the new statements we've created to initialize fields
      // 3. the statements currently comprising the body of the constructor
      statements = [createConstructorBodyWithSuper(), ...statements, ...constructorBodyStatements];
    } else {
      // if no super is needed then the body of the constructor should be:
      //
      // 1. the new statements we've created to initialize fields
      // 2. the statements currently comprising the body of the constructor
      statements = [...statements, ...constructorBodyStatements];
    }

    classMembers[constructorIndex] = ts.factory.updateConstructorDeclaration(
      constructorMethod,
      retrieveTsModifiers(constructorMethod),
      constructorMethod.parameters,
      ts.factory.updateBlock(constructorMethod?.body ?? ts.factory.createBlock([]), statements),
    );
  } else {
    // we don't seem to have a constructor, so let's create one and stick it
    // into the array of class elements
    if (needsSuper(classNode)) {
      statements = [createConstructorBodyWithSuper(), ...statements];
    }

    classMembers = [
      ts.factory.createConstructorDeclaration(undefined, [], ts.factory.createBlock(statements, true)),
      ...classMembers,
    ];
  }

  return classMembers;
};

/**
 * Create a statement with a call to `super()` suitable for including in the body of a constructor.
 * @returns a {@link ts.ExpressionStatement} node equivalent to `super()`
 */
const createConstructorBodyWithSuper = (): ts.ExpressionStatement => {
  return ts.factory.createExpressionStatement(
    ts.factory.createCallExpression(ts.factory.createIdentifier('super'), undefined, undefined),
  );
};

/**
 * Check that a given class declaration should have a `super()` call in its
 * constructor. This is something we can check by looking for a
 * {@link ts.HeritageClause} on the class's AST node.
 *
 * @param classDeclaration a class declaration AST node
 * @returns whether this class has parents or not
 */
const needsSuper = (classDeclaration: ts.ClassDeclaration): boolean => {
  const hasHeritageClauses = classDeclaration.heritageClauses && classDeclaration.heritageClauses.length > 0;

  if (hasHeritageClauses) {
    // A {@link ts.SyntaxKind.HeritageClause} node may be for extending a
    // superclass _or_ for implementing an interface. We only want to add a
    // `super()` call to our synthetic constructor here in the case that there
    // is a superclass, so we can check for that situation by checking for the
    // presence of a heritage clause with the `.token` property set to
    // `ts.SyntaxKind.ExtendsKeyword`.
    return classDeclaration.heritageClauses.some((clause) => clause.token === ts.SyntaxKind.ExtendsKeyword);
  }
  return false;
};
