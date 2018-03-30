/* tslint:disable */
/*
 * Custom Type Definitions
 * When including 3rd party modules you also need to include the type definition for the module
 * if they don't provide one within the module. You can try to install it with @types

npm install @types/node
npm install @types/lodash

 * If you can't find the type definition in the registry we can make an ambient/global definition in
 * this file for now. For example

declare module 'my-module' {
 export function doesSomething(value: string): string;
}

 * If you are using a CommonJS module that is using module.exports then you will have to write your
 * types using export = yourObjectOrFunction with a namespace above it
 * notice how we have to create a namespace that is equal to the function we're
 * assigning the export to

declare module 'jwt-decode' {
  function jwtDecode(token: string): any;
  namespace jwtDecode {}
  export = jwtDecode;
}

 *
 * If you're prototying and you will fix the types later you can also declare it as type any
 *

declare var assert: any;
declare var _: any;
declare var $: any;

 *
 * If you're importing a module that uses Node.js modules which are CommonJS you need to import as
 * in the files such as main.browser.ts or any file within app/
 *

import * as _ from 'lodash'

 * You can include your type definitions in this file until you create one for the @types
 *
 */

// support NodeJS modules without type definitions
declare module '*';

declare var twemoji: Twemoji;

/*
// for legacy tslint etc to understand rename 'modern-lru' with your package
// then comment out `declare module '*';`. For each new module copy/paste
// this method of creating an `any` module type definition
declare module 'modern-lru' {
  let x: any;
  export = x;
}
*/

interface Twemoji {
  convert: {
    /**
     * Given an HEX codepoint, returns UTF16 surrogate pairs.
     *
     * @param codePoint generic codepoint, i.e. '1F4A9'
     * @return  codepoint transformed into utf16 surrogates pair,
     *          i.e. \uD83D\uDCA9
     *
     * @example
     *  twemoji.convert.fromCodePoint('1f1e8');
     *  // "\ud83c\udde8"
     *
     *  '1f1e8-1f1f3'.split('-').map(twemoji.convert.fromCodePoint).join('')
     *  // "\ud83c\udde8\ud83c\uddf3"
     */
    fromCodePoint(codePoint: string): string;

    /**
     * Given UTF16 surrogate pairs, returns the equivalent HEX codepoint.
     *
     * @param emoji  generic utf16 surrogates pair, i.e. \uD83D\uDCA9
     * @param separator optional separator for double code points, default='-'
     * @return utf16 transformed into codepoint, i.e. '1F4A9'
     *
     * @example
     *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3');
     *  // "1f1e8-1f1f3"
     *
     *  twemoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3', '~');
     *  // "1f1e8~1f1f3"
     */
    toCodePoint(emoji: string, separator?: string): string;
  },
    /**
   * Main method/logic to generate either <img> tags or HTMLImage nodes.
   *  "emojify" a generic text or DOM Element.
   *
   * @overloads
   *
   * String replacement for `innerHTML` or server side operations
   *  twemoji.parse(string);
   *  twemoji.parse(string, Function);
   *  twemoji.parse(string, Object);
   *
   * @param   source              the source to parse and enrich with emoji.
   *
   *                              replace emoji matches with <img> tags.
   *                              Mainly used to inject emoji via `innerHTML`
   *                              It does **not** parse the string or validate it,
   *                              it simply replaces found emoji with a tag.
   *                              NOTE: be sure this won't affect security.
   *
   * @param   callback            [optional]
   *                              either the callback that will be invoked or an object
   *                              with all properties to use per each found emoji.
   *
   *                              if specified, this will be invoked per each emoji
   *                              that has been found through the RegExp except
   *                              those follwed by the invariant \uFE0E ("as text").
   *                              Once invoked, parameters will be:
   *
   *                                iconId:string     the lower case HEX code point
   *                                                  i.e. "1f4a9"
   *
   *                                options:Object    all info for this parsing operation
   *
   *                                variant:char      the optional \uFE0F ("as image")
   *                                                  variant, in case this info
   *                                                  is anyhow meaningful.
   *                                                  By default this is ignored.
   *
   *                              If such callback will return a falsy value instead
   *                              of a valid `src` to use for the image, nothing will
   *                              actually change for that specific emoji.
   *
   * @example
   *
   *  twemoji.parse("I \u2764\uFE0F emoji!");
   *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"/> emoji!
   *
   *
   *  twemoji.parse("I \u2764\uFE0F emoji!", function(iconId, options) {
   *    return '/assets/' + iconId + '.gif';
   *  });
   *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/2764.gif"/> emoji!
   *
   *
   * twemoji.parse("I \u2764\uFE0F emoji!", {
   *   size: 72,
   *   callback: function(iconId, options) {
   *     return '/assets/' + options.size + '/' + iconId + options.ext;
   *   }
   * });
   *  // I <img class="emoji" draggable="false" alt="❤️" src="/assets/72x72/2764.png"/> emoji!
   *
   */
  parse(source: string, callback?: (iconId: string, options: any, variant: string) => string): string;
}

// Extra variables that live on Global that will be replaced by webpack DefinePlugin
declare var ENV: string;
declare var HMR: boolean;
declare var System: SystemJS;

interface SystemJS {
  import: (path?: string) => Promise<any>;
}

interface GlobalEnvironment {
  ENV: string;
  HMR: boolean;
  SystemJS: SystemJS;
  System: SystemJS;
}

interface Es6PromiseLoader {
  (id: string): (exportName?: string) => Promise<any>;
}

type FactoryEs6PromiseLoader = () => Es6PromiseLoader;
type FactoryPromise = () => Promise<any>;

type AsyncRoutes = {
  [component: string]: Es6PromiseLoader |
                               Function |
                FactoryEs6PromiseLoader |
                         FactoryPromise ;
};

type IdleCallbacks = Es6PromiseLoader |
                             Function |
              FactoryEs6PromiseLoader |
                       FactoryPromise ;

interface WebpackModule {
  hot: {
    data?: any,
    idle: any,
    accept(dependencies?: string | string[], callback?: (updatedDependencies?: any) => void): void;
    decline(deps?: any | string | string[]): void;
    dispose(callback?: (data?: any) => void): void;
    addDisposeHandler(callback?: (data?: any) => void): void;
    removeDisposeHandler(callback?: (data?: any) => void): void;
    check(autoApply?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
    apply(options?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
    status(callback?: (status?: string) => void): void | string;
    removeStatusHandler(callback?: (status?: string) => void): void;
  };
}

interface WebpackRequire {
    (id: string): any;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure(ids: string[], callback: (req: WebpackRequire) => void, chunkName?: string): void;
    context(directory: string, useSubDirectories?: boolean, regExp?: RegExp): WebpackContext;
}

interface WebpackContext extends WebpackRequire {
    keys(): string[];
}

interface ErrorStackTraceLimit {
  stackTraceLimit: number;
}

// Extend typings
interface NodeRequire extends WebpackRequire {}
interface ErrorConstructor extends ErrorStackTraceLimit {}
interface NodeRequireFunction extends Es6PromiseLoader  {}
interface NodeModule extends WebpackModule {}
interface Global extends GlobalEnvironment  {}
