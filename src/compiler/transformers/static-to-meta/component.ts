import { join, normalizePath, relative, unique } from '@utils';
import { dirname, isAbsolute } from 'path';
import ts from 'typescript';

import type * as d from '../../../declarations';
import { addComponentMetaStatic } from '../add-component-meta-static';
import { setComponentBuildConditionals } from '../component-build-conditionals';
import { getComponentTagName, getStaticValue, isInternal, isStaticGetter, serializeSymbol } from '../transform-utils';
import { parseCallExpression } from './call-expression';
import { parseClassMethods } from './class-methods';
import { parseStaticElementRef } from './element-ref';
import { parseStaticEncapsulation, parseStaticShadowDelegatesFocus } from './encapsulation';
import { parseStaticEvents } from './events';
import { parseFormAssociated } from './form-associated';
import { parseAttachInternals } from './attach-internals';
import { parseStaticListeners } from './listeners';
import { parseStaticMethods } from './methods';
import { parseStaticProps } from './props';
import { parseStaticStates } from './states';
import { parseStringLiteral } from './string-literal';
import { parseStaticStyles } from './styles';
import { parseStaticWatchers } from './watchers';

/**
 * Given an instance of TypeScript's Intermediate Representation (IR) for a
 * class declaration ({@see ts.ClassDeclaration}) which represents a Stencil
 * component class declaration, parse and format various pieces of data about
 * static class members which we use in the compilation process
 *
 * @param compilerCtx the current compiler context
 * @param typeChecker a TypeScript type checker instance
 * @param cmpNode the TypeScript class declaration for the component
 * @param moduleFile Stencil's IR for a module, used here as an out param
 * @param transformOpts options which control various aspects of the
 * transformation
 * @returns the TypeScript class declaration IR instance with which the
 * function was called
 */
export const parseStaticComponentMeta = (
  compilerCtx: d.CompilerCtx,
  typeChecker: ts.TypeChecker,
  cmpNode: ts.ClassDeclaration,
  moduleFile: d.Module,
  transformOpts?: d.TransformOptions,
): ts.ClassDeclaration => {
  if (cmpNode.members == null) {
    return cmpNode;
  }
  const staticMembers = cmpNode.members.filter(isStaticGetter);
  const tagName = getComponentTagName(staticMembers);
  if (tagName == null) {
    return cmpNode;
  }

  const symbol = typeChecker ? typeChecker.getSymbolAtLocation(cmpNode.name) : undefined;
  const docs = serializeSymbol(typeChecker, symbol);
  const isCollectionDependency = moduleFile.isCollectionDependency;
  const encapsulation = parseStaticEncapsulation(staticMembers);
  const cmp: d.ComponentCompilerMeta = {
    assetsDirs: parseAssetsDirs(staticMembers, moduleFile.jsFilePath),
    attachInternalsMemberName: parseAttachInternals(staticMembers),
    componentClassName: cmpNode.name ? cmpNode.name.text : '',
    docs,
    elementRef: parseStaticElementRef(staticMembers),
    encapsulation,
    events: parseStaticEvents(staticMembers),
    excludeFromCollection: moduleFile.excludeFromCollection,
    formAssociated: parseFormAssociated(staticMembers),
    hasAttribute: false,
    hasAttributeChangedCallbackFn: false,
    hasComponentDidLoadFn: false,
    hasComponentDidRenderFn: false,
    hasComponentDidUnloadFn: false,
    hasComponentDidUpdateFn: false,
    hasComponentShouldUpdateFn: false,
    hasComponentWillLoadFn: false,
    hasComponentWillRenderFn: false,
    hasComponentWillUpdateFn: false,
    hasConnectedCallbackFn: false,
    hasDisconnectedCallbackFn: false,
    hasElement: false,
    hasEvent: false,
    hasLifecycle: false,
    hasListener: false,
    hasListenerTarget: false,
    hasListenerTargetBody: false,
    hasListenerTargetDocument: false,
    hasListenerTargetParent: false,
    hasListenerTargetWindow: false,
    hasMember: false,
    hasMethod: false,
    hasMode: false,
    hasProp: false,
    hasPropBoolean: false,
    hasPropMutable: false,
    hasPropNumber: false,
    hasPropString: false,
    hasReflect: false,
    hasRenderFn: false,
    hasState: false,
    hasStyle: false,
    hasVdomAttribute: false,
    hasVdomClass: false,
    hasVdomFunctional: false,
    hasVdomKey: false,
    hasVdomListener: false,
    hasVdomPropOrAttr: false,
    hasVdomRef: false,
    hasVdomRender: false,
    hasVdomStyle: false,
    hasVdomText: false,
    hasVdomXlink: false,
    hasWatchCallback: false,
    htmlAttrNames: [],
    htmlParts: [],
    htmlTagNames: [],
    internal: isInternal(docs),
    isCollectionDependency,
    isPlain: false,
    isUpdateable: false,
    jsFilePath: moduleFile.jsFilePath,
    listeners: parseStaticListeners(staticMembers),
    methods: parseStaticMethods(staticMembers),
    potentialCmpRefs: [],
    properties: parseStaticProps(staticMembers),
    shadowDelegatesFocus: parseStaticShadowDelegatesFocus(encapsulation, staticMembers),
    sourceFilePath: moduleFile.sourceFilePath,
    sourceMapPath: moduleFile.sourceMapPath,
    states: parseStaticStates(staticMembers),
    styleDocs: [],
    styles: parseStaticStyles(compilerCtx, tagName, moduleFile.sourceFilePath, isCollectionDependency, staticMembers),
    tagName: tagName,
    virtualProperties: parseVirtualProps(docs),
    watchers: parseStaticWatchers(staticMembers),
  };

  const visitComponentChildNode = (node: ts.Node) => {
    if (ts.isCallExpression(node)) {
      parseCallExpression(cmp, node);
    } else if (ts.isStringLiteral(node)) {
      parseStringLiteral(cmp, node);
    }
    node.forEachChild(visitComponentChildNode);
  };
  visitComponentChildNode(cmpNode);
  parseClassMethods(cmpNode, cmp);

  cmp.htmlAttrNames = unique(cmp.htmlAttrNames);
  cmp.htmlTagNames = unique(cmp.htmlTagNames);
  cmp.potentialCmpRefs = unique(cmp.potentialCmpRefs);
  setComponentBuildConditionals(cmp);

  if (transformOpts && transformOpts.componentMetadata === 'compilerstatic') {
    cmpNode = addComponentMetaStatic(cmpNode, cmp);
  }

  // add to module map
  moduleFile.cmps.push(cmp);

  // add to node map
  compilerCtx.nodeMap.set(cmpNode, cmp);

  return cmpNode;
};

const parseVirtualProps = (docs: d.CompilerJsDoc) => {
  return docs.tags
    .filter(({ name }) => name === 'virtualProp')
    .map(parseVirtualProp)
    .filter((prop) => !!prop);
};

const parseVirtualProp = (tag: d.CompilerJsDocTagInfo): d.ComponentCompilerVirtualProperty => {
  const results = /^\s*(?:\{([^}]+)\}\s+)?(\w+)\s+-\s+(.*)$/.exec(tag.text);
  if (!results) {
    return undefined;
  }
  const [, type, name, docs] = results;
  return {
    type: type == null ? 'any' : type.trim(),
    name: name.trim(),
    docs: docs.trim(),
  };
};

const parseAssetsDirs = (staticMembers: ts.ClassElement[], componentFilePath: string): d.AssetsMeta[] => {
  const dirs: string[] = getStaticValue(staticMembers, 'assetsDirs') || [];
  const componentDir = normalizePath(dirname(componentFilePath));

  return dirs.map((dir) => {
    // get the relative path from the component file to the assets directory
    dir = normalizePath(dir.trim());

    let absolutePath = dir;
    let cmpRelativePath = dir;
    if (isAbsolute(dir)) {
      // if this is an absolute path already, let's convert it to be relative
      cmpRelativePath = relative(componentDir, dir);
    } else {
      // create the absolute path to the asset dir
      absolutePath = join(componentDir, dir);
    }
    return {
      absolutePath,
      cmpRelativePath,
      originalComponentPath: dir,
    };
  });
};
