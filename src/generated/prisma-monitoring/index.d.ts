
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model RevisionReport
 * 
 */
export type RevisionReport = $Result.DefaultSelection<Prisma.$RevisionReportPayload>
/**
 * Model RevisionComment
 * 
 */
export type RevisionComment = $Result.DefaultSelection<Prisma.$RevisionCommentPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more RevisionReports
 * const revisionReports = await prisma.revisionReport.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more RevisionReports
   * const revisionReports = await prisma.revisionReport.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.revisionReport`: Exposes CRUD operations for the **RevisionReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RevisionReports
    * const revisionReports = await prisma.revisionReport.findMany()
    * ```
    */
  get revisionReport(): Prisma.RevisionReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.revisionComment`: Exposes CRUD operations for the **RevisionComment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RevisionComments
    * const revisionComments = await prisma.revisionComment.findMany()
    * ```
    */
  get revisionComment(): Prisma.RevisionCommentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    RevisionReport: 'RevisionReport',
    RevisionComment: 'RevisionComment',
    Notification: 'Notification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "revisionReport" | "revisionComment" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      RevisionReport: {
        payload: Prisma.$RevisionReportPayload<ExtArgs>
        fields: Prisma.RevisionReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RevisionReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RevisionReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionReportPayload>
          }
          findFirst: {
            args: Prisma.RevisionReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RevisionReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionReportPayload>
          }
          findMany: {
            args: Prisma.RevisionReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionReportPayload>[]
          }
          create: {
            args: Prisma.RevisionReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionReportPayload>
          }
          createMany: {
            args: Prisma.RevisionReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RevisionReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionReportPayload>
          }
          update: {
            args: Prisma.RevisionReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionReportPayload>
          }
          deleteMany: {
            args: Prisma.RevisionReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RevisionReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RevisionReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionReportPayload>
          }
          aggregate: {
            args: Prisma.RevisionReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRevisionReport>
          }
          groupBy: {
            args: Prisma.RevisionReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<RevisionReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.RevisionReportCountArgs<ExtArgs>
            result: $Utils.Optional<RevisionReportCountAggregateOutputType> | number
          }
        }
      }
      RevisionComment: {
        payload: Prisma.$RevisionCommentPayload<ExtArgs>
        fields: Prisma.RevisionCommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RevisionCommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionCommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RevisionCommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionCommentPayload>
          }
          findFirst: {
            args: Prisma.RevisionCommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionCommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RevisionCommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionCommentPayload>
          }
          findMany: {
            args: Prisma.RevisionCommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionCommentPayload>[]
          }
          create: {
            args: Prisma.RevisionCommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionCommentPayload>
          }
          createMany: {
            args: Prisma.RevisionCommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RevisionCommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionCommentPayload>
          }
          update: {
            args: Prisma.RevisionCommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionCommentPayload>
          }
          deleteMany: {
            args: Prisma.RevisionCommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RevisionCommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RevisionCommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevisionCommentPayload>
          }
          aggregate: {
            args: Prisma.RevisionCommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRevisionComment>
          }
          groupBy: {
            args: Prisma.RevisionCommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<RevisionCommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.RevisionCommentCountArgs<ExtArgs>
            result: $Utils.Optional<RevisionCommentCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    revisionReport?: RevisionReportOmit
    revisionComment?: RevisionCommentOmit
    notification?: NotificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type RevisionReportCountOutputType
   */

  export type RevisionReportCountOutputType = {
    comments: number
  }

  export type RevisionReportCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | RevisionReportCountOutputTypeCountCommentsArgs
  }

  // Custom InputTypes
  /**
   * RevisionReportCountOutputType without action
   */
  export type RevisionReportCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionReportCountOutputType
     */
    select?: RevisionReportCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RevisionReportCountOutputType without action
   */
  export type RevisionReportCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RevisionCommentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model RevisionReport
   */

  export type AggregateRevisionReport = {
    _count: RevisionReportCountAggregateOutputType | null
    _min: RevisionReportMinAggregateOutputType | null
    _max: RevisionReportMaxAggregateOutputType | null
  }

  export type RevisionReportMinAggregateOutputType = {
    id: string | null
    projectName: string | null
    issueType: string | null
    description: string | null
    progress: string | null
    approval: string | null
    approvalNote: string | null
    senderRole: string | null
    targetRole: string | null
    targetUserId: string | null
    sentById: string | null
    attachmentName: string | null
    attachmentUrl: string | null
    attachmentData: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RevisionReportMaxAggregateOutputType = {
    id: string | null
    projectName: string | null
    issueType: string | null
    description: string | null
    progress: string | null
    approval: string | null
    approvalNote: string | null
    senderRole: string | null
    targetRole: string | null
    targetUserId: string | null
    sentById: string | null
    attachmentName: string | null
    attachmentUrl: string | null
    attachmentData: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RevisionReportCountAggregateOutputType = {
    id: number
    projectName: number
    issueType: number
    description: number
    progress: number
    approval: number
    approvalNote: number
    senderRole: number
    targetRole: number
    targetUserId: number
    sentById: number
    attachmentName: number
    attachmentUrl: number
    attachmentData: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RevisionReportMinAggregateInputType = {
    id?: true
    projectName?: true
    issueType?: true
    description?: true
    progress?: true
    approval?: true
    approvalNote?: true
    senderRole?: true
    targetRole?: true
    targetUserId?: true
    sentById?: true
    attachmentName?: true
    attachmentUrl?: true
    attachmentData?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RevisionReportMaxAggregateInputType = {
    id?: true
    projectName?: true
    issueType?: true
    description?: true
    progress?: true
    approval?: true
    approvalNote?: true
    senderRole?: true
    targetRole?: true
    targetUserId?: true
    sentById?: true
    attachmentName?: true
    attachmentUrl?: true
    attachmentData?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RevisionReportCountAggregateInputType = {
    id?: true
    projectName?: true
    issueType?: true
    description?: true
    progress?: true
    approval?: true
    approvalNote?: true
    senderRole?: true
    targetRole?: true
    targetUserId?: true
    sentById?: true
    attachmentName?: true
    attachmentUrl?: true
    attachmentData?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RevisionReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RevisionReport to aggregate.
     */
    where?: RevisionReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevisionReports to fetch.
     */
    orderBy?: RevisionReportOrderByWithRelationInput | RevisionReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RevisionReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevisionReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevisionReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RevisionReports
    **/
    _count?: true | RevisionReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RevisionReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RevisionReportMaxAggregateInputType
  }

  export type GetRevisionReportAggregateType<T extends RevisionReportAggregateArgs> = {
        [P in keyof T & keyof AggregateRevisionReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRevisionReport[P]>
      : GetScalarType<T[P], AggregateRevisionReport[P]>
  }




  export type RevisionReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RevisionReportWhereInput
    orderBy?: RevisionReportOrderByWithAggregationInput | RevisionReportOrderByWithAggregationInput[]
    by: RevisionReportScalarFieldEnum[] | RevisionReportScalarFieldEnum
    having?: RevisionReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RevisionReportCountAggregateInputType | true
    _min?: RevisionReportMinAggregateInputType
    _max?: RevisionReportMaxAggregateInputType
  }

  export type RevisionReportGroupByOutputType = {
    id: string
    projectName: string
    issueType: string
    description: string | null
    progress: string
    approval: string
    approvalNote: string | null
    senderRole: string
    targetRole: string
    targetUserId: string | null
    sentById: string | null
    attachmentName: string | null
    attachmentUrl: string | null
    attachmentData: string | null
    createdAt: Date
    updatedAt: Date
    _count: RevisionReportCountAggregateOutputType | null
    _min: RevisionReportMinAggregateOutputType | null
    _max: RevisionReportMaxAggregateOutputType | null
  }

  type GetRevisionReportGroupByPayload<T extends RevisionReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RevisionReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RevisionReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RevisionReportGroupByOutputType[P]>
            : GetScalarType<T[P], RevisionReportGroupByOutputType[P]>
        }
      >
    >


  export type RevisionReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectName?: boolean
    issueType?: boolean
    description?: boolean
    progress?: boolean
    approval?: boolean
    approvalNote?: boolean
    senderRole?: boolean
    targetRole?: boolean
    targetUserId?: boolean
    sentById?: boolean
    attachmentName?: boolean
    attachmentUrl?: boolean
    attachmentData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    comments?: boolean | RevisionReport$commentsArgs<ExtArgs>
    _count?: boolean | RevisionReportCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["revisionReport"]>



  export type RevisionReportSelectScalar = {
    id?: boolean
    projectName?: boolean
    issueType?: boolean
    description?: boolean
    progress?: boolean
    approval?: boolean
    approvalNote?: boolean
    senderRole?: boolean
    targetRole?: boolean
    targetUserId?: boolean
    sentById?: boolean
    attachmentName?: boolean
    attachmentUrl?: boolean
    attachmentData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RevisionReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectName" | "issueType" | "description" | "progress" | "approval" | "approvalNote" | "senderRole" | "targetRole" | "targetUserId" | "sentById" | "attachmentName" | "attachmentUrl" | "attachmentData" | "createdAt" | "updatedAt", ExtArgs["result"]["revisionReport"]>
  export type RevisionReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    comments?: boolean | RevisionReport$commentsArgs<ExtArgs>
    _count?: boolean | RevisionReportCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $RevisionReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RevisionReport"
    objects: {
      comments: Prisma.$RevisionCommentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectName: string
      issueType: string
      description: string | null
      progress: string
      approval: string
      approvalNote: string | null
      senderRole: string
      targetRole: string
      targetUserId: string | null
      sentById: string | null
      attachmentName: string | null
      attachmentUrl: string | null
      attachmentData: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["revisionReport"]>
    composites: {}
  }

  type RevisionReportGetPayload<S extends boolean | null | undefined | RevisionReportDefaultArgs> = $Result.GetResult<Prisma.$RevisionReportPayload, S>

  type RevisionReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RevisionReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RevisionReportCountAggregateInputType | true
    }

  export interface RevisionReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RevisionReport'], meta: { name: 'RevisionReport' } }
    /**
     * Find zero or one RevisionReport that matches the filter.
     * @param {RevisionReportFindUniqueArgs} args - Arguments to find a RevisionReport
     * @example
     * // Get one RevisionReport
     * const revisionReport = await prisma.revisionReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RevisionReportFindUniqueArgs>(args: SelectSubset<T, RevisionReportFindUniqueArgs<ExtArgs>>): Prisma__RevisionReportClient<$Result.GetResult<Prisma.$RevisionReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RevisionReport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RevisionReportFindUniqueOrThrowArgs} args - Arguments to find a RevisionReport
     * @example
     * // Get one RevisionReport
     * const revisionReport = await prisma.revisionReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RevisionReportFindUniqueOrThrowArgs>(args: SelectSubset<T, RevisionReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RevisionReportClient<$Result.GetResult<Prisma.$RevisionReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RevisionReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionReportFindFirstArgs} args - Arguments to find a RevisionReport
     * @example
     * // Get one RevisionReport
     * const revisionReport = await prisma.revisionReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RevisionReportFindFirstArgs>(args?: SelectSubset<T, RevisionReportFindFirstArgs<ExtArgs>>): Prisma__RevisionReportClient<$Result.GetResult<Prisma.$RevisionReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RevisionReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionReportFindFirstOrThrowArgs} args - Arguments to find a RevisionReport
     * @example
     * // Get one RevisionReport
     * const revisionReport = await prisma.revisionReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RevisionReportFindFirstOrThrowArgs>(args?: SelectSubset<T, RevisionReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__RevisionReportClient<$Result.GetResult<Prisma.$RevisionReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RevisionReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RevisionReports
     * const revisionReports = await prisma.revisionReport.findMany()
     * 
     * // Get first 10 RevisionReports
     * const revisionReports = await prisma.revisionReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const revisionReportWithIdOnly = await prisma.revisionReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RevisionReportFindManyArgs>(args?: SelectSubset<T, RevisionReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RevisionReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RevisionReport.
     * @param {RevisionReportCreateArgs} args - Arguments to create a RevisionReport.
     * @example
     * // Create one RevisionReport
     * const RevisionReport = await prisma.revisionReport.create({
     *   data: {
     *     // ... data to create a RevisionReport
     *   }
     * })
     * 
     */
    create<T extends RevisionReportCreateArgs>(args: SelectSubset<T, RevisionReportCreateArgs<ExtArgs>>): Prisma__RevisionReportClient<$Result.GetResult<Prisma.$RevisionReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RevisionReports.
     * @param {RevisionReportCreateManyArgs} args - Arguments to create many RevisionReports.
     * @example
     * // Create many RevisionReports
     * const revisionReport = await prisma.revisionReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RevisionReportCreateManyArgs>(args?: SelectSubset<T, RevisionReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a RevisionReport.
     * @param {RevisionReportDeleteArgs} args - Arguments to delete one RevisionReport.
     * @example
     * // Delete one RevisionReport
     * const RevisionReport = await prisma.revisionReport.delete({
     *   where: {
     *     // ... filter to delete one RevisionReport
     *   }
     * })
     * 
     */
    delete<T extends RevisionReportDeleteArgs>(args: SelectSubset<T, RevisionReportDeleteArgs<ExtArgs>>): Prisma__RevisionReportClient<$Result.GetResult<Prisma.$RevisionReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RevisionReport.
     * @param {RevisionReportUpdateArgs} args - Arguments to update one RevisionReport.
     * @example
     * // Update one RevisionReport
     * const revisionReport = await prisma.revisionReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RevisionReportUpdateArgs>(args: SelectSubset<T, RevisionReportUpdateArgs<ExtArgs>>): Prisma__RevisionReportClient<$Result.GetResult<Prisma.$RevisionReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RevisionReports.
     * @param {RevisionReportDeleteManyArgs} args - Arguments to filter RevisionReports to delete.
     * @example
     * // Delete a few RevisionReports
     * const { count } = await prisma.revisionReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RevisionReportDeleteManyArgs>(args?: SelectSubset<T, RevisionReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RevisionReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RevisionReports
     * const revisionReport = await prisma.revisionReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RevisionReportUpdateManyArgs>(args: SelectSubset<T, RevisionReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RevisionReport.
     * @param {RevisionReportUpsertArgs} args - Arguments to update or create a RevisionReport.
     * @example
     * // Update or create a RevisionReport
     * const revisionReport = await prisma.revisionReport.upsert({
     *   create: {
     *     // ... data to create a RevisionReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RevisionReport we want to update
     *   }
     * })
     */
    upsert<T extends RevisionReportUpsertArgs>(args: SelectSubset<T, RevisionReportUpsertArgs<ExtArgs>>): Prisma__RevisionReportClient<$Result.GetResult<Prisma.$RevisionReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RevisionReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionReportCountArgs} args - Arguments to filter RevisionReports to count.
     * @example
     * // Count the number of RevisionReports
     * const count = await prisma.revisionReport.count({
     *   where: {
     *     // ... the filter for the RevisionReports we want to count
     *   }
     * })
    **/
    count<T extends RevisionReportCountArgs>(
      args?: Subset<T, RevisionReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RevisionReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RevisionReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RevisionReportAggregateArgs>(args: Subset<T, RevisionReportAggregateArgs>): Prisma.PrismaPromise<GetRevisionReportAggregateType<T>>

    /**
     * Group by RevisionReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RevisionReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RevisionReportGroupByArgs['orderBy'] }
        : { orderBy?: RevisionReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RevisionReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRevisionReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RevisionReport model
   */
  readonly fields: RevisionReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RevisionReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RevisionReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    comments<T extends RevisionReport$commentsArgs<ExtArgs> = {}>(args?: Subset<T, RevisionReport$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RevisionCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RevisionReport model
   */
  interface RevisionReportFieldRefs {
    readonly id: FieldRef<"RevisionReport", 'String'>
    readonly projectName: FieldRef<"RevisionReport", 'String'>
    readonly issueType: FieldRef<"RevisionReport", 'String'>
    readonly description: FieldRef<"RevisionReport", 'String'>
    readonly progress: FieldRef<"RevisionReport", 'String'>
    readonly approval: FieldRef<"RevisionReport", 'String'>
    readonly approvalNote: FieldRef<"RevisionReport", 'String'>
    readonly senderRole: FieldRef<"RevisionReport", 'String'>
    readonly targetRole: FieldRef<"RevisionReport", 'String'>
    readonly targetUserId: FieldRef<"RevisionReport", 'String'>
    readonly sentById: FieldRef<"RevisionReport", 'String'>
    readonly attachmentName: FieldRef<"RevisionReport", 'String'>
    readonly attachmentUrl: FieldRef<"RevisionReport", 'String'>
    readonly attachmentData: FieldRef<"RevisionReport", 'String'>
    readonly createdAt: FieldRef<"RevisionReport", 'DateTime'>
    readonly updatedAt: FieldRef<"RevisionReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RevisionReport findUnique
   */
  export type RevisionReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionReport
     */
    select?: RevisionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionReport
     */
    omit?: RevisionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionReportInclude<ExtArgs> | null
    /**
     * Filter, which RevisionReport to fetch.
     */
    where: RevisionReportWhereUniqueInput
  }

  /**
   * RevisionReport findUniqueOrThrow
   */
  export type RevisionReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionReport
     */
    select?: RevisionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionReport
     */
    omit?: RevisionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionReportInclude<ExtArgs> | null
    /**
     * Filter, which RevisionReport to fetch.
     */
    where: RevisionReportWhereUniqueInput
  }

  /**
   * RevisionReport findFirst
   */
  export type RevisionReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionReport
     */
    select?: RevisionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionReport
     */
    omit?: RevisionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionReportInclude<ExtArgs> | null
    /**
     * Filter, which RevisionReport to fetch.
     */
    where?: RevisionReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevisionReports to fetch.
     */
    orderBy?: RevisionReportOrderByWithRelationInput | RevisionReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RevisionReports.
     */
    cursor?: RevisionReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevisionReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevisionReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RevisionReports.
     */
    distinct?: RevisionReportScalarFieldEnum | RevisionReportScalarFieldEnum[]
  }

  /**
   * RevisionReport findFirstOrThrow
   */
  export type RevisionReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionReport
     */
    select?: RevisionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionReport
     */
    omit?: RevisionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionReportInclude<ExtArgs> | null
    /**
     * Filter, which RevisionReport to fetch.
     */
    where?: RevisionReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevisionReports to fetch.
     */
    orderBy?: RevisionReportOrderByWithRelationInput | RevisionReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RevisionReports.
     */
    cursor?: RevisionReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevisionReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevisionReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RevisionReports.
     */
    distinct?: RevisionReportScalarFieldEnum | RevisionReportScalarFieldEnum[]
  }

  /**
   * RevisionReport findMany
   */
  export type RevisionReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionReport
     */
    select?: RevisionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionReport
     */
    omit?: RevisionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionReportInclude<ExtArgs> | null
    /**
     * Filter, which RevisionReports to fetch.
     */
    where?: RevisionReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevisionReports to fetch.
     */
    orderBy?: RevisionReportOrderByWithRelationInput | RevisionReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RevisionReports.
     */
    cursor?: RevisionReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevisionReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevisionReports.
     */
    skip?: number
    distinct?: RevisionReportScalarFieldEnum | RevisionReportScalarFieldEnum[]
  }

  /**
   * RevisionReport create
   */
  export type RevisionReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionReport
     */
    select?: RevisionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionReport
     */
    omit?: RevisionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionReportInclude<ExtArgs> | null
    /**
     * The data needed to create a RevisionReport.
     */
    data: XOR<RevisionReportCreateInput, RevisionReportUncheckedCreateInput>
  }

  /**
   * RevisionReport createMany
   */
  export type RevisionReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RevisionReports.
     */
    data: RevisionReportCreateManyInput | RevisionReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RevisionReport update
   */
  export type RevisionReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionReport
     */
    select?: RevisionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionReport
     */
    omit?: RevisionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionReportInclude<ExtArgs> | null
    /**
     * The data needed to update a RevisionReport.
     */
    data: XOR<RevisionReportUpdateInput, RevisionReportUncheckedUpdateInput>
    /**
     * Choose, which RevisionReport to update.
     */
    where: RevisionReportWhereUniqueInput
  }

  /**
   * RevisionReport updateMany
   */
  export type RevisionReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RevisionReports.
     */
    data: XOR<RevisionReportUpdateManyMutationInput, RevisionReportUncheckedUpdateManyInput>
    /**
     * Filter which RevisionReports to update
     */
    where?: RevisionReportWhereInput
    /**
     * Limit how many RevisionReports to update.
     */
    limit?: number
  }

  /**
   * RevisionReport upsert
   */
  export type RevisionReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionReport
     */
    select?: RevisionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionReport
     */
    omit?: RevisionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionReportInclude<ExtArgs> | null
    /**
     * The filter to search for the RevisionReport to update in case it exists.
     */
    where: RevisionReportWhereUniqueInput
    /**
     * In case the RevisionReport found by the `where` argument doesn't exist, create a new RevisionReport with this data.
     */
    create: XOR<RevisionReportCreateInput, RevisionReportUncheckedCreateInput>
    /**
     * In case the RevisionReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RevisionReportUpdateInput, RevisionReportUncheckedUpdateInput>
  }

  /**
   * RevisionReport delete
   */
  export type RevisionReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionReport
     */
    select?: RevisionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionReport
     */
    omit?: RevisionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionReportInclude<ExtArgs> | null
    /**
     * Filter which RevisionReport to delete.
     */
    where: RevisionReportWhereUniqueInput
  }

  /**
   * RevisionReport deleteMany
   */
  export type RevisionReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RevisionReports to delete
     */
    where?: RevisionReportWhereInput
    /**
     * Limit how many RevisionReports to delete.
     */
    limit?: number
  }

  /**
   * RevisionReport.comments
   */
  export type RevisionReport$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionComment
     */
    select?: RevisionCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionComment
     */
    omit?: RevisionCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionCommentInclude<ExtArgs> | null
    where?: RevisionCommentWhereInput
    orderBy?: RevisionCommentOrderByWithRelationInput | RevisionCommentOrderByWithRelationInput[]
    cursor?: RevisionCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RevisionCommentScalarFieldEnum | RevisionCommentScalarFieldEnum[]
  }

  /**
   * RevisionReport without action
   */
  export type RevisionReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionReport
     */
    select?: RevisionReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionReport
     */
    omit?: RevisionReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionReportInclude<ExtArgs> | null
  }


  /**
   * Model RevisionComment
   */

  export type AggregateRevisionComment = {
    _count: RevisionCommentCountAggregateOutputType | null
    _min: RevisionCommentMinAggregateOutputType | null
    _max: RevisionCommentMaxAggregateOutputType | null
  }

  export type RevisionCommentMinAggregateOutputType = {
    id: string | null
    content: string | null
    authorId: string | null
    reportId: string | null
    createdAt: Date | null
  }

  export type RevisionCommentMaxAggregateOutputType = {
    id: string | null
    content: string | null
    authorId: string | null
    reportId: string | null
    createdAt: Date | null
  }

  export type RevisionCommentCountAggregateOutputType = {
    id: number
    content: number
    authorId: number
    reportId: number
    createdAt: number
    _all: number
  }


  export type RevisionCommentMinAggregateInputType = {
    id?: true
    content?: true
    authorId?: true
    reportId?: true
    createdAt?: true
  }

  export type RevisionCommentMaxAggregateInputType = {
    id?: true
    content?: true
    authorId?: true
    reportId?: true
    createdAt?: true
  }

  export type RevisionCommentCountAggregateInputType = {
    id?: true
    content?: true
    authorId?: true
    reportId?: true
    createdAt?: true
    _all?: true
  }

  export type RevisionCommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RevisionComment to aggregate.
     */
    where?: RevisionCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevisionComments to fetch.
     */
    orderBy?: RevisionCommentOrderByWithRelationInput | RevisionCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RevisionCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevisionComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevisionComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RevisionComments
    **/
    _count?: true | RevisionCommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RevisionCommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RevisionCommentMaxAggregateInputType
  }

  export type GetRevisionCommentAggregateType<T extends RevisionCommentAggregateArgs> = {
        [P in keyof T & keyof AggregateRevisionComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRevisionComment[P]>
      : GetScalarType<T[P], AggregateRevisionComment[P]>
  }




  export type RevisionCommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RevisionCommentWhereInput
    orderBy?: RevisionCommentOrderByWithAggregationInput | RevisionCommentOrderByWithAggregationInput[]
    by: RevisionCommentScalarFieldEnum[] | RevisionCommentScalarFieldEnum
    having?: RevisionCommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RevisionCommentCountAggregateInputType | true
    _min?: RevisionCommentMinAggregateInputType
    _max?: RevisionCommentMaxAggregateInputType
  }

  export type RevisionCommentGroupByOutputType = {
    id: string
    content: string
    authorId: string
    reportId: string
    createdAt: Date
    _count: RevisionCommentCountAggregateOutputType | null
    _min: RevisionCommentMinAggregateOutputType | null
    _max: RevisionCommentMaxAggregateOutputType | null
  }

  type GetRevisionCommentGroupByPayload<T extends RevisionCommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RevisionCommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RevisionCommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RevisionCommentGroupByOutputType[P]>
            : GetScalarType<T[P], RevisionCommentGroupByOutputType[P]>
        }
      >
    >


  export type RevisionCommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    authorId?: boolean
    reportId?: boolean
    createdAt?: boolean
    report?: boolean | RevisionReportDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["revisionComment"]>



  export type RevisionCommentSelectScalar = {
    id?: boolean
    content?: boolean
    authorId?: boolean
    reportId?: boolean
    createdAt?: boolean
  }

  export type RevisionCommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "authorId" | "reportId" | "createdAt", ExtArgs["result"]["revisionComment"]>
  export type RevisionCommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    report?: boolean | RevisionReportDefaultArgs<ExtArgs>
  }

  export type $RevisionCommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RevisionComment"
    objects: {
      report: Prisma.$RevisionReportPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      authorId: string
      reportId: string
      createdAt: Date
    }, ExtArgs["result"]["revisionComment"]>
    composites: {}
  }

  type RevisionCommentGetPayload<S extends boolean | null | undefined | RevisionCommentDefaultArgs> = $Result.GetResult<Prisma.$RevisionCommentPayload, S>

  type RevisionCommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RevisionCommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RevisionCommentCountAggregateInputType | true
    }

  export interface RevisionCommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RevisionComment'], meta: { name: 'RevisionComment' } }
    /**
     * Find zero or one RevisionComment that matches the filter.
     * @param {RevisionCommentFindUniqueArgs} args - Arguments to find a RevisionComment
     * @example
     * // Get one RevisionComment
     * const revisionComment = await prisma.revisionComment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RevisionCommentFindUniqueArgs>(args: SelectSubset<T, RevisionCommentFindUniqueArgs<ExtArgs>>): Prisma__RevisionCommentClient<$Result.GetResult<Prisma.$RevisionCommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RevisionComment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RevisionCommentFindUniqueOrThrowArgs} args - Arguments to find a RevisionComment
     * @example
     * // Get one RevisionComment
     * const revisionComment = await prisma.revisionComment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RevisionCommentFindUniqueOrThrowArgs>(args: SelectSubset<T, RevisionCommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RevisionCommentClient<$Result.GetResult<Prisma.$RevisionCommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RevisionComment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionCommentFindFirstArgs} args - Arguments to find a RevisionComment
     * @example
     * // Get one RevisionComment
     * const revisionComment = await prisma.revisionComment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RevisionCommentFindFirstArgs>(args?: SelectSubset<T, RevisionCommentFindFirstArgs<ExtArgs>>): Prisma__RevisionCommentClient<$Result.GetResult<Prisma.$RevisionCommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RevisionComment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionCommentFindFirstOrThrowArgs} args - Arguments to find a RevisionComment
     * @example
     * // Get one RevisionComment
     * const revisionComment = await prisma.revisionComment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RevisionCommentFindFirstOrThrowArgs>(args?: SelectSubset<T, RevisionCommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__RevisionCommentClient<$Result.GetResult<Prisma.$RevisionCommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RevisionComments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionCommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RevisionComments
     * const revisionComments = await prisma.revisionComment.findMany()
     * 
     * // Get first 10 RevisionComments
     * const revisionComments = await prisma.revisionComment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const revisionCommentWithIdOnly = await prisma.revisionComment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RevisionCommentFindManyArgs>(args?: SelectSubset<T, RevisionCommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RevisionCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RevisionComment.
     * @param {RevisionCommentCreateArgs} args - Arguments to create a RevisionComment.
     * @example
     * // Create one RevisionComment
     * const RevisionComment = await prisma.revisionComment.create({
     *   data: {
     *     // ... data to create a RevisionComment
     *   }
     * })
     * 
     */
    create<T extends RevisionCommentCreateArgs>(args: SelectSubset<T, RevisionCommentCreateArgs<ExtArgs>>): Prisma__RevisionCommentClient<$Result.GetResult<Prisma.$RevisionCommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RevisionComments.
     * @param {RevisionCommentCreateManyArgs} args - Arguments to create many RevisionComments.
     * @example
     * // Create many RevisionComments
     * const revisionComment = await prisma.revisionComment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RevisionCommentCreateManyArgs>(args?: SelectSubset<T, RevisionCommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a RevisionComment.
     * @param {RevisionCommentDeleteArgs} args - Arguments to delete one RevisionComment.
     * @example
     * // Delete one RevisionComment
     * const RevisionComment = await prisma.revisionComment.delete({
     *   where: {
     *     // ... filter to delete one RevisionComment
     *   }
     * })
     * 
     */
    delete<T extends RevisionCommentDeleteArgs>(args: SelectSubset<T, RevisionCommentDeleteArgs<ExtArgs>>): Prisma__RevisionCommentClient<$Result.GetResult<Prisma.$RevisionCommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RevisionComment.
     * @param {RevisionCommentUpdateArgs} args - Arguments to update one RevisionComment.
     * @example
     * // Update one RevisionComment
     * const revisionComment = await prisma.revisionComment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RevisionCommentUpdateArgs>(args: SelectSubset<T, RevisionCommentUpdateArgs<ExtArgs>>): Prisma__RevisionCommentClient<$Result.GetResult<Prisma.$RevisionCommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RevisionComments.
     * @param {RevisionCommentDeleteManyArgs} args - Arguments to filter RevisionComments to delete.
     * @example
     * // Delete a few RevisionComments
     * const { count } = await prisma.revisionComment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RevisionCommentDeleteManyArgs>(args?: SelectSubset<T, RevisionCommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RevisionComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionCommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RevisionComments
     * const revisionComment = await prisma.revisionComment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RevisionCommentUpdateManyArgs>(args: SelectSubset<T, RevisionCommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RevisionComment.
     * @param {RevisionCommentUpsertArgs} args - Arguments to update or create a RevisionComment.
     * @example
     * // Update or create a RevisionComment
     * const revisionComment = await prisma.revisionComment.upsert({
     *   create: {
     *     // ... data to create a RevisionComment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RevisionComment we want to update
     *   }
     * })
     */
    upsert<T extends RevisionCommentUpsertArgs>(args: SelectSubset<T, RevisionCommentUpsertArgs<ExtArgs>>): Prisma__RevisionCommentClient<$Result.GetResult<Prisma.$RevisionCommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RevisionComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionCommentCountArgs} args - Arguments to filter RevisionComments to count.
     * @example
     * // Count the number of RevisionComments
     * const count = await prisma.revisionComment.count({
     *   where: {
     *     // ... the filter for the RevisionComments we want to count
     *   }
     * })
    **/
    count<T extends RevisionCommentCountArgs>(
      args?: Subset<T, RevisionCommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RevisionCommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RevisionComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionCommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RevisionCommentAggregateArgs>(args: Subset<T, RevisionCommentAggregateArgs>): Prisma.PrismaPromise<GetRevisionCommentAggregateType<T>>

    /**
     * Group by RevisionComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevisionCommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RevisionCommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RevisionCommentGroupByArgs['orderBy'] }
        : { orderBy?: RevisionCommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RevisionCommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRevisionCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RevisionComment model
   */
  readonly fields: RevisionCommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RevisionComment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RevisionCommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    report<T extends RevisionReportDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RevisionReportDefaultArgs<ExtArgs>>): Prisma__RevisionReportClient<$Result.GetResult<Prisma.$RevisionReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RevisionComment model
   */
  interface RevisionCommentFieldRefs {
    readonly id: FieldRef<"RevisionComment", 'String'>
    readonly content: FieldRef<"RevisionComment", 'String'>
    readonly authorId: FieldRef<"RevisionComment", 'String'>
    readonly reportId: FieldRef<"RevisionComment", 'String'>
    readonly createdAt: FieldRef<"RevisionComment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RevisionComment findUnique
   */
  export type RevisionCommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionComment
     */
    select?: RevisionCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionComment
     */
    omit?: RevisionCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionCommentInclude<ExtArgs> | null
    /**
     * Filter, which RevisionComment to fetch.
     */
    where: RevisionCommentWhereUniqueInput
  }

  /**
   * RevisionComment findUniqueOrThrow
   */
  export type RevisionCommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionComment
     */
    select?: RevisionCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionComment
     */
    omit?: RevisionCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionCommentInclude<ExtArgs> | null
    /**
     * Filter, which RevisionComment to fetch.
     */
    where: RevisionCommentWhereUniqueInput
  }

  /**
   * RevisionComment findFirst
   */
  export type RevisionCommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionComment
     */
    select?: RevisionCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionComment
     */
    omit?: RevisionCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionCommentInclude<ExtArgs> | null
    /**
     * Filter, which RevisionComment to fetch.
     */
    where?: RevisionCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevisionComments to fetch.
     */
    orderBy?: RevisionCommentOrderByWithRelationInput | RevisionCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RevisionComments.
     */
    cursor?: RevisionCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevisionComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevisionComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RevisionComments.
     */
    distinct?: RevisionCommentScalarFieldEnum | RevisionCommentScalarFieldEnum[]
  }

  /**
   * RevisionComment findFirstOrThrow
   */
  export type RevisionCommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionComment
     */
    select?: RevisionCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionComment
     */
    omit?: RevisionCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionCommentInclude<ExtArgs> | null
    /**
     * Filter, which RevisionComment to fetch.
     */
    where?: RevisionCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevisionComments to fetch.
     */
    orderBy?: RevisionCommentOrderByWithRelationInput | RevisionCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RevisionComments.
     */
    cursor?: RevisionCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevisionComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevisionComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RevisionComments.
     */
    distinct?: RevisionCommentScalarFieldEnum | RevisionCommentScalarFieldEnum[]
  }

  /**
   * RevisionComment findMany
   */
  export type RevisionCommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionComment
     */
    select?: RevisionCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionComment
     */
    omit?: RevisionCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionCommentInclude<ExtArgs> | null
    /**
     * Filter, which RevisionComments to fetch.
     */
    where?: RevisionCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevisionComments to fetch.
     */
    orderBy?: RevisionCommentOrderByWithRelationInput | RevisionCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RevisionComments.
     */
    cursor?: RevisionCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevisionComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevisionComments.
     */
    skip?: number
    distinct?: RevisionCommentScalarFieldEnum | RevisionCommentScalarFieldEnum[]
  }

  /**
   * RevisionComment create
   */
  export type RevisionCommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionComment
     */
    select?: RevisionCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionComment
     */
    omit?: RevisionCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionCommentInclude<ExtArgs> | null
    /**
     * The data needed to create a RevisionComment.
     */
    data: XOR<RevisionCommentCreateInput, RevisionCommentUncheckedCreateInput>
  }

  /**
   * RevisionComment createMany
   */
  export type RevisionCommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RevisionComments.
     */
    data: RevisionCommentCreateManyInput | RevisionCommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RevisionComment update
   */
  export type RevisionCommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionComment
     */
    select?: RevisionCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionComment
     */
    omit?: RevisionCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionCommentInclude<ExtArgs> | null
    /**
     * The data needed to update a RevisionComment.
     */
    data: XOR<RevisionCommentUpdateInput, RevisionCommentUncheckedUpdateInput>
    /**
     * Choose, which RevisionComment to update.
     */
    where: RevisionCommentWhereUniqueInput
  }

  /**
   * RevisionComment updateMany
   */
  export type RevisionCommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RevisionComments.
     */
    data: XOR<RevisionCommentUpdateManyMutationInput, RevisionCommentUncheckedUpdateManyInput>
    /**
     * Filter which RevisionComments to update
     */
    where?: RevisionCommentWhereInput
    /**
     * Limit how many RevisionComments to update.
     */
    limit?: number
  }

  /**
   * RevisionComment upsert
   */
  export type RevisionCommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionComment
     */
    select?: RevisionCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionComment
     */
    omit?: RevisionCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionCommentInclude<ExtArgs> | null
    /**
     * The filter to search for the RevisionComment to update in case it exists.
     */
    where: RevisionCommentWhereUniqueInput
    /**
     * In case the RevisionComment found by the `where` argument doesn't exist, create a new RevisionComment with this data.
     */
    create: XOR<RevisionCommentCreateInput, RevisionCommentUncheckedCreateInput>
    /**
     * In case the RevisionComment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RevisionCommentUpdateInput, RevisionCommentUncheckedUpdateInput>
  }

  /**
   * RevisionComment delete
   */
  export type RevisionCommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionComment
     */
    select?: RevisionCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionComment
     */
    omit?: RevisionCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionCommentInclude<ExtArgs> | null
    /**
     * Filter which RevisionComment to delete.
     */
    where: RevisionCommentWhereUniqueInput
  }

  /**
   * RevisionComment deleteMany
   */
  export type RevisionCommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RevisionComments to delete
     */
    where?: RevisionCommentWhereInput
    /**
     * Limit how many RevisionComments to delete.
     */
    limit?: number
  }

  /**
   * RevisionComment without action
   */
  export type RevisionCommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevisionComment
     */
    select?: RevisionCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevisionComment
     */
    omit?: RevisionCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevisionCommentInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    message: string | null
    type: string | null
    link: string | null
    isRead: boolean | null
    icon: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    message: string | null
    type: string | null
    link: string | null
    isRead: boolean | null
    icon: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    message: number
    type: number
    link: number
    isRead: number
    icon: number
    color: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    message?: true
    type?: true
    link?: true
    isRead?: true
    icon?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    message?: true
    type?: true
    link?: true
    isRead?: true
    icon?: true
    color?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    message?: true
    type?: true
    link?: true
    isRead?: true
    icon?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    userId: string
    title: string
    message: string
    type: string
    link: string | null
    isRead: boolean
    icon: string | null
    color: string | null
    createdAt: Date
    updatedAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    link?: boolean
    isRead?: boolean
    icon?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["notification"]>



  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    link?: boolean
    isRead?: boolean
    icon?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "message" | "type" | "link" | "isRead" | "icon" | "color" | "createdAt" | "updatedAt", ExtArgs["result"]["notification"]>

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      message: string
      type: string
      link: string | null
      isRead: boolean
      icon: string | null
      color: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly link: FieldRef<"Notification", 'String'>
    readonly isRead: FieldRef<"Notification", 'Boolean'>
    readonly icon: FieldRef<"Notification", 'String'>
    readonly color: FieldRef<"Notification", 'String'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
    readonly updatedAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const RevisionReportScalarFieldEnum: {
    id: 'id',
    projectName: 'projectName',
    issueType: 'issueType',
    description: 'description',
    progress: 'progress',
    approval: 'approval',
    approvalNote: 'approvalNote',
    senderRole: 'senderRole',
    targetRole: 'targetRole',
    targetUserId: 'targetUserId',
    sentById: 'sentById',
    attachmentName: 'attachmentName',
    attachmentUrl: 'attachmentUrl',
    attachmentData: 'attachmentData',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RevisionReportScalarFieldEnum = (typeof RevisionReportScalarFieldEnum)[keyof typeof RevisionReportScalarFieldEnum]


  export const RevisionCommentScalarFieldEnum: {
    id: 'id',
    content: 'content',
    authorId: 'authorId',
    reportId: 'reportId',
    createdAt: 'createdAt'
  };

  export type RevisionCommentScalarFieldEnum = (typeof RevisionCommentScalarFieldEnum)[keyof typeof RevisionCommentScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    message: 'message',
    type: 'type',
    link: 'link',
    isRead: 'isRead',
    icon: 'icon',
    color: 'color',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const RevisionReportOrderByRelevanceFieldEnum: {
    id: 'id',
    projectName: 'projectName',
    issueType: 'issueType',
    description: 'description',
    progress: 'progress',
    approval: 'approval',
    approvalNote: 'approvalNote',
    senderRole: 'senderRole',
    targetRole: 'targetRole',
    targetUserId: 'targetUserId',
    sentById: 'sentById',
    attachmentName: 'attachmentName',
    attachmentUrl: 'attachmentUrl',
    attachmentData: 'attachmentData'
  };

  export type RevisionReportOrderByRelevanceFieldEnum = (typeof RevisionReportOrderByRelevanceFieldEnum)[keyof typeof RevisionReportOrderByRelevanceFieldEnum]


  export const RevisionCommentOrderByRelevanceFieldEnum: {
    id: 'id',
    content: 'content',
    authorId: 'authorId',
    reportId: 'reportId'
  };

  export type RevisionCommentOrderByRelevanceFieldEnum = (typeof RevisionCommentOrderByRelevanceFieldEnum)[keyof typeof RevisionCommentOrderByRelevanceFieldEnum]


  export const NotificationOrderByRelevanceFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    message: 'message',
    type: 'type',
    link: 'link',
    icon: 'icon',
    color: 'color'
  };

  export type NotificationOrderByRelevanceFieldEnum = (typeof NotificationOrderByRelevanceFieldEnum)[keyof typeof NotificationOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type RevisionReportWhereInput = {
    AND?: RevisionReportWhereInput | RevisionReportWhereInput[]
    OR?: RevisionReportWhereInput[]
    NOT?: RevisionReportWhereInput | RevisionReportWhereInput[]
    id?: StringFilter<"RevisionReport"> | string
    projectName?: StringFilter<"RevisionReport"> | string
    issueType?: StringFilter<"RevisionReport"> | string
    description?: StringNullableFilter<"RevisionReport"> | string | null
    progress?: StringFilter<"RevisionReport"> | string
    approval?: StringFilter<"RevisionReport"> | string
    approvalNote?: StringNullableFilter<"RevisionReport"> | string | null
    senderRole?: StringFilter<"RevisionReport"> | string
    targetRole?: StringFilter<"RevisionReport"> | string
    targetUserId?: StringNullableFilter<"RevisionReport"> | string | null
    sentById?: StringNullableFilter<"RevisionReport"> | string | null
    attachmentName?: StringNullableFilter<"RevisionReport"> | string | null
    attachmentUrl?: StringNullableFilter<"RevisionReport"> | string | null
    attachmentData?: StringNullableFilter<"RevisionReport"> | string | null
    createdAt?: DateTimeFilter<"RevisionReport"> | Date | string
    updatedAt?: DateTimeFilter<"RevisionReport"> | Date | string
    comments?: RevisionCommentListRelationFilter
  }

  export type RevisionReportOrderByWithRelationInput = {
    id?: SortOrder
    projectName?: SortOrder
    issueType?: SortOrder
    description?: SortOrderInput | SortOrder
    progress?: SortOrder
    approval?: SortOrder
    approvalNote?: SortOrderInput | SortOrder
    senderRole?: SortOrder
    targetRole?: SortOrder
    targetUserId?: SortOrderInput | SortOrder
    sentById?: SortOrderInput | SortOrder
    attachmentName?: SortOrderInput | SortOrder
    attachmentUrl?: SortOrderInput | SortOrder
    attachmentData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    comments?: RevisionCommentOrderByRelationAggregateInput
    _relevance?: RevisionReportOrderByRelevanceInput
  }

  export type RevisionReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RevisionReportWhereInput | RevisionReportWhereInput[]
    OR?: RevisionReportWhereInput[]
    NOT?: RevisionReportWhereInput | RevisionReportWhereInput[]
    projectName?: StringFilter<"RevisionReport"> | string
    issueType?: StringFilter<"RevisionReport"> | string
    description?: StringNullableFilter<"RevisionReport"> | string | null
    progress?: StringFilter<"RevisionReport"> | string
    approval?: StringFilter<"RevisionReport"> | string
    approvalNote?: StringNullableFilter<"RevisionReport"> | string | null
    senderRole?: StringFilter<"RevisionReport"> | string
    targetRole?: StringFilter<"RevisionReport"> | string
    targetUserId?: StringNullableFilter<"RevisionReport"> | string | null
    sentById?: StringNullableFilter<"RevisionReport"> | string | null
    attachmentName?: StringNullableFilter<"RevisionReport"> | string | null
    attachmentUrl?: StringNullableFilter<"RevisionReport"> | string | null
    attachmentData?: StringNullableFilter<"RevisionReport"> | string | null
    createdAt?: DateTimeFilter<"RevisionReport"> | Date | string
    updatedAt?: DateTimeFilter<"RevisionReport"> | Date | string
    comments?: RevisionCommentListRelationFilter
  }, "id">

  export type RevisionReportOrderByWithAggregationInput = {
    id?: SortOrder
    projectName?: SortOrder
    issueType?: SortOrder
    description?: SortOrderInput | SortOrder
    progress?: SortOrder
    approval?: SortOrder
    approvalNote?: SortOrderInput | SortOrder
    senderRole?: SortOrder
    targetRole?: SortOrder
    targetUserId?: SortOrderInput | SortOrder
    sentById?: SortOrderInput | SortOrder
    attachmentName?: SortOrderInput | SortOrder
    attachmentUrl?: SortOrderInput | SortOrder
    attachmentData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RevisionReportCountOrderByAggregateInput
    _max?: RevisionReportMaxOrderByAggregateInput
    _min?: RevisionReportMinOrderByAggregateInput
  }

  export type RevisionReportScalarWhereWithAggregatesInput = {
    AND?: RevisionReportScalarWhereWithAggregatesInput | RevisionReportScalarWhereWithAggregatesInput[]
    OR?: RevisionReportScalarWhereWithAggregatesInput[]
    NOT?: RevisionReportScalarWhereWithAggregatesInput | RevisionReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RevisionReport"> | string
    projectName?: StringWithAggregatesFilter<"RevisionReport"> | string
    issueType?: StringWithAggregatesFilter<"RevisionReport"> | string
    description?: StringNullableWithAggregatesFilter<"RevisionReport"> | string | null
    progress?: StringWithAggregatesFilter<"RevisionReport"> | string
    approval?: StringWithAggregatesFilter<"RevisionReport"> | string
    approvalNote?: StringNullableWithAggregatesFilter<"RevisionReport"> | string | null
    senderRole?: StringWithAggregatesFilter<"RevisionReport"> | string
    targetRole?: StringWithAggregatesFilter<"RevisionReport"> | string
    targetUserId?: StringNullableWithAggregatesFilter<"RevisionReport"> | string | null
    sentById?: StringNullableWithAggregatesFilter<"RevisionReport"> | string | null
    attachmentName?: StringNullableWithAggregatesFilter<"RevisionReport"> | string | null
    attachmentUrl?: StringNullableWithAggregatesFilter<"RevisionReport"> | string | null
    attachmentData?: StringNullableWithAggregatesFilter<"RevisionReport"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RevisionReport"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RevisionReport"> | Date | string
  }

  export type RevisionCommentWhereInput = {
    AND?: RevisionCommentWhereInput | RevisionCommentWhereInput[]
    OR?: RevisionCommentWhereInput[]
    NOT?: RevisionCommentWhereInput | RevisionCommentWhereInput[]
    id?: StringFilter<"RevisionComment"> | string
    content?: StringFilter<"RevisionComment"> | string
    authorId?: StringFilter<"RevisionComment"> | string
    reportId?: StringFilter<"RevisionComment"> | string
    createdAt?: DateTimeFilter<"RevisionComment"> | Date | string
    report?: XOR<RevisionReportScalarRelationFilter, RevisionReportWhereInput>
  }

  export type RevisionCommentOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    reportId?: SortOrder
    createdAt?: SortOrder
    report?: RevisionReportOrderByWithRelationInput
    _relevance?: RevisionCommentOrderByRelevanceInput
  }

  export type RevisionCommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RevisionCommentWhereInput | RevisionCommentWhereInput[]
    OR?: RevisionCommentWhereInput[]
    NOT?: RevisionCommentWhereInput | RevisionCommentWhereInput[]
    content?: StringFilter<"RevisionComment"> | string
    authorId?: StringFilter<"RevisionComment"> | string
    reportId?: StringFilter<"RevisionComment"> | string
    createdAt?: DateTimeFilter<"RevisionComment"> | Date | string
    report?: XOR<RevisionReportScalarRelationFilter, RevisionReportWhereInput>
  }, "id">

  export type RevisionCommentOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    reportId?: SortOrder
    createdAt?: SortOrder
    _count?: RevisionCommentCountOrderByAggregateInput
    _max?: RevisionCommentMaxOrderByAggregateInput
    _min?: RevisionCommentMinOrderByAggregateInput
  }

  export type RevisionCommentScalarWhereWithAggregatesInput = {
    AND?: RevisionCommentScalarWhereWithAggregatesInput | RevisionCommentScalarWhereWithAggregatesInput[]
    OR?: RevisionCommentScalarWhereWithAggregatesInput[]
    NOT?: RevisionCommentScalarWhereWithAggregatesInput | RevisionCommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RevisionComment"> | string
    content?: StringWithAggregatesFilter<"RevisionComment"> | string
    authorId?: StringWithAggregatesFilter<"RevisionComment"> | string
    reportId?: StringWithAggregatesFilter<"RevisionComment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"RevisionComment"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    link?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    icon?: StringNullableFilter<"Notification"> | string | null
    color?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    link?: SortOrderInput | SortOrder
    isRead?: SortOrder
    icon?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _relevance?: NotificationOrderByRelevanceInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    link?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    icon?: StringNullableFilter<"Notification"> | string | null
    color?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    link?: SortOrderInput | SortOrder
    isRead?: SortOrder
    icon?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    userId?: StringWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    type?: StringWithAggregatesFilter<"Notification"> | string
    link?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    isRead?: BoolWithAggregatesFilter<"Notification"> | boolean
    icon?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    color?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type RevisionReportCreateInput = {
    id?: string
    projectName: string
    issueType?: string
    description?: string | null
    progress?: string
    approval?: string
    approvalNote?: string | null
    senderRole: string
    targetRole: string
    targetUserId?: string | null
    sentById?: string | null
    attachmentName?: string | null
    attachmentUrl?: string | null
    attachmentData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: RevisionCommentCreateNestedManyWithoutReportInput
  }

  export type RevisionReportUncheckedCreateInput = {
    id?: string
    projectName: string
    issueType?: string
    description?: string | null
    progress?: string
    approval?: string
    approvalNote?: string | null
    senderRole: string
    targetRole: string
    targetUserId?: string | null
    sentById?: string | null
    attachmentName?: string | null
    attachmentUrl?: string | null
    attachmentData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: RevisionCommentUncheckedCreateNestedManyWithoutReportInput
  }

  export type RevisionReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    issueType?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: StringFieldUpdateOperationsInput | string
    approval?: StringFieldUpdateOperationsInput | string
    approvalNote?: NullableStringFieldUpdateOperationsInput | string | null
    senderRole?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableStringFieldUpdateOperationsInput | string | null
    sentById?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: RevisionCommentUpdateManyWithoutReportNestedInput
  }

  export type RevisionReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    issueType?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: StringFieldUpdateOperationsInput | string
    approval?: StringFieldUpdateOperationsInput | string
    approvalNote?: NullableStringFieldUpdateOperationsInput | string | null
    senderRole?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableStringFieldUpdateOperationsInput | string | null
    sentById?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: RevisionCommentUncheckedUpdateManyWithoutReportNestedInput
  }

  export type RevisionReportCreateManyInput = {
    id?: string
    projectName: string
    issueType?: string
    description?: string | null
    progress?: string
    approval?: string
    approvalNote?: string | null
    senderRole: string
    targetRole: string
    targetUserId?: string | null
    sentById?: string | null
    attachmentName?: string | null
    attachmentUrl?: string | null
    attachmentData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RevisionReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    issueType?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: StringFieldUpdateOperationsInput | string
    approval?: StringFieldUpdateOperationsInput | string
    approvalNote?: NullableStringFieldUpdateOperationsInput | string | null
    senderRole?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableStringFieldUpdateOperationsInput | string | null
    sentById?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevisionReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    issueType?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: StringFieldUpdateOperationsInput | string
    approval?: StringFieldUpdateOperationsInput | string
    approvalNote?: NullableStringFieldUpdateOperationsInput | string | null
    senderRole?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableStringFieldUpdateOperationsInput | string | null
    sentById?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevisionCommentCreateInput = {
    id?: string
    content: string
    authorId: string
    createdAt?: Date | string
    report: RevisionReportCreateNestedOneWithoutCommentsInput
  }

  export type RevisionCommentUncheckedCreateInput = {
    id?: string
    content: string
    authorId: string
    reportId: string
    createdAt?: Date | string
  }

  export type RevisionCommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    report?: RevisionReportUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type RevisionCommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    reportId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevisionCommentCreateManyInput = {
    id?: string
    content: string
    authorId: string
    reportId: string
    createdAt?: Date | string
  }

  export type RevisionCommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevisionCommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    reportId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    userId: string
    title: string
    message: string
    type?: string
    link?: string | null
    isRead?: boolean
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    message: string
    type?: string
    link?: string | null
    isRead?: boolean
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    userId: string
    title: string
    message: string
    type?: string
    link?: string | null
    isRead?: boolean
    icon?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type RevisionCommentListRelationFilter = {
    every?: RevisionCommentWhereInput
    some?: RevisionCommentWhereInput
    none?: RevisionCommentWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RevisionCommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RevisionReportOrderByRelevanceInput = {
    fields: RevisionReportOrderByRelevanceFieldEnum | RevisionReportOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type RevisionReportCountOrderByAggregateInput = {
    id?: SortOrder
    projectName?: SortOrder
    issueType?: SortOrder
    description?: SortOrder
    progress?: SortOrder
    approval?: SortOrder
    approvalNote?: SortOrder
    senderRole?: SortOrder
    targetRole?: SortOrder
    targetUserId?: SortOrder
    sentById?: SortOrder
    attachmentName?: SortOrder
    attachmentUrl?: SortOrder
    attachmentData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RevisionReportMaxOrderByAggregateInput = {
    id?: SortOrder
    projectName?: SortOrder
    issueType?: SortOrder
    description?: SortOrder
    progress?: SortOrder
    approval?: SortOrder
    approvalNote?: SortOrder
    senderRole?: SortOrder
    targetRole?: SortOrder
    targetUserId?: SortOrder
    sentById?: SortOrder
    attachmentName?: SortOrder
    attachmentUrl?: SortOrder
    attachmentData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RevisionReportMinOrderByAggregateInput = {
    id?: SortOrder
    projectName?: SortOrder
    issueType?: SortOrder
    description?: SortOrder
    progress?: SortOrder
    approval?: SortOrder
    approvalNote?: SortOrder
    senderRole?: SortOrder
    targetRole?: SortOrder
    targetUserId?: SortOrder
    sentById?: SortOrder
    attachmentName?: SortOrder
    attachmentUrl?: SortOrder
    attachmentData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type RevisionReportScalarRelationFilter = {
    is?: RevisionReportWhereInput
    isNot?: RevisionReportWhereInput
  }

  export type RevisionCommentOrderByRelevanceInput = {
    fields: RevisionCommentOrderByRelevanceFieldEnum | RevisionCommentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type RevisionCommentCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    reportId?: SortOrder
    createdAt?: SortOrder
  }

  export type RevisionCommentMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    reportId?: SortOrder
    createdAt?: SortOrder
  }

  export type RevisionCommentMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    authorId?: SortOrder
    reportId?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NotificationOrderByRelevanceInput = {
    fields: NotificationOrderByRelevanceFieldEnum | NotificationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    link?: SortOrder
    isRead?: SortOrder
    icon?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    link?: SortOrder
    isRead?: SortOrder
    icon?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    link?: SortOrder
    isRead?: SortOrder
    icon?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type RevisionCommentCreateNestedManyWithoutReportInput = {
    create?: XOR<RevisionCommentCreateWithoutReportInput, RevisionCommentUncheckedCreateWithoutReportInput> | RevisionCommentCreateWithoutReportInput[] | RevisionCommentUncheckedCreateWithoutReportInput[]
    connectOrCreate?: RevisionCommentCreateOrConnectWithoutReportInput | RevisionCommentCreateOrConnectWithoutReportInput[]
    createMany?: RevisionCommentCreateManyReportInputEnvelope
    connect?: RevisionCommentWhereUniqueInput | RevisionCommentWhereUniqueInput[]
  }

  export type RevisionCommentUncheckedCreateNestedManyWithoutReportInput = {
    create?: XOR<RevisionCommentCreateWithoutReportInput, RevisionCommentUncheckedCreateWithoutReportInput> | RevisionCommentCreateWithoutReportInput[] | RevisionCommentUncheckedCreateWithoutReportInput[]
    connectOrCreate?: RevisionCommentCreateOrConnectWithoutReportInput | RevisionCommentCreateOrConnectWithoutReportInput[]
    createMany?: RevisionCommentCreateManyReportInputEnvelope
    connect?: RevisionCommentWhereUniqueInput | RevisionCommentWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type RevisionCommentUpdateManyWithoutReportNestedInput = {
    create?: XOR<RevisionCommentCreateWithoutReportInput, RevisionCommentUncheckedCreateWithoutReportInput> | RevisionCommentCreateWithoutReportInput[] | RevisionCommentUncheckedCreateWithoutReportInput[]
    connectOrCreate?: RevisionCommentCreateOrConnectWithoutReportInput | RevisionCommentCreateOrConnectWithoutReportInput[]
    upsert?: RevisionCommentUpsertWithWhereUniqueWithoutReportInput | RevisionCommentUpsertWithWhereUniqueWithoutReportInput[]
    createMany?: RevisionCommentCreateManyReportInputEnvelope
    set?: RevisionCommentWhereUniqueInput | RevisionCommentWhereUniqueInput[]
    disconnect?: RevisionCommentWhereUniqueInput | RevisionCommentWhereUniqueInput[]
    delete?: RevisionCommentWhereUniqueInput | RevisionCommentWhereUniqueInput[]
    connect?: RevisionCommentWhereUniqueInput | RevisionCommentWhereUniqueInput[]
    update?: RevisionCommentUpdateWithWhereUniqueWithoutReportInput | RevisionCommentUpdateWithWhereUniqueWithoutReportInput[]
    updateMany?: RevisionCommentUpdateManyWithWhereWithoutReportInput | RevisionCommentUpdateManyWithWhereWithoutReportInput[]
    deleteMany?: RevisionCommentScalarWhereInput | RevisionCommentScalarWhereInput[]
  }

  export type RevisionCommentUncheckedUpdateManyWithoutReportNestedInput = {
    create?: XOR<RevisionCommentCreateWithoutReportInput, RevisionCommentUncheckedCreateWithoutReportInput> | RevisionCommentCreateWithoutReportInput[] | RevisionCommentUncheckedCreateWithoutReportInput[]
    connectOrCreate?: RevisionCommentCreateOrConnectWithoutReportInput | RevisionCommentCreateOrConnectWithoutReportInput[]
    upsert?: RevisionCommentUpsertWithWhereUniqueWithoutReportInput | RevisionCommentUpsertWithWhereUniqueWithoutReportInput[]
    createMany?: RevisionCommentCreateManyReportInputEnvelope
    set?: RevisionCommentWhereUniqueInput | RevisionCommentWhereUniqueInput[]
    disconnect?: RevisionCommentWhereUniqueInput | RevisionCommentWhereUniqueInput[]
    delete?: RevisionCommentWhereUniqueInput | RevisionCommentWhereUniqueInput[]
    connect?: RevisionCommentWhereUniqueInput | RevisionCommentWhereUniqueInput[]
    update?: RevisionCommentUpdateWithWhereUniqueWithoutReportInput | RevisionCommentUpdateWithWhereUniqueWithoutReportInput[]
    updateMany?: RevisionCommentUpdateManyWithWhereWithoutReportInput | RevisionCommentUpdateManyWithWhereWithoutReportInput[]
    deleteMany?: RevisionCommentScalarWhereInput | RevisionCommentScalarWhereInput[]
  }

  export type RevisionReportCreateNestedOneWithoutCommentsInput = {
    create?: XOR<RevisionReportCreateWithoutCommentsInput, RevisionReportUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: RevisionReportCreateOrConnectWithoutCommentsInput
    connect?: RevisionReportWhereUniqueInput
  }

  export type RevisionReportUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<RevisionReportCreateWithoutCommentsInput, RevisionReportUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: RevisionReportCreateOrConnectWithoutCommentsInput
    upsert?: RevisionReportUpsertWithoutCommentsInput
    connect?: RevisionReportWhereUniqueInput
    update?: XOR<XOR<RevisionReportUpdateToOneWithWhereWithoutCommentsInput, RevisionReportUpdateWithoutCommentsInput>, RevisionReportUncheckedUpdateWithoutCommentsInput>
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type RevisionCommentCreateWithoutReportInput = {
    id?: string
    content: string
    authorId: string
    createdAt?: Date | string
  }

  export type RevisionCommentUncheckedCreateWithoutReportInput = {
    id?: string
    content: string
    authorId: string
    createdAt?: Date | string
  }

  export type RevisionCommentCreateOrConnectWithoutReportInput = {
    where: RevisionCommentWhereUniqueInput
    create: XOR<RevisionCommentCreateWithoutReportInput, RevisionCommentUncheckedCreateWithoutReportInput>
  }

  export type RevisionCommentCreateManyReportInputEnvelope = {
    data: RevisionCommentCreateManyReportInput | RevisionCommentCreateManyReportInput[]
    skipDuplicates?: boolean
  }

  export type RevisionCommentUpsertWithWhereUniqueWithoutReportInput = {
    where: RevisionCommentWhereUniqueInput
    update: XOR<RevisionCommentUpdateWithoutReportInput, RevisionCommentUncheckedUpdateWithoutReportInput>
    create: XOR<RevisionCommentCreateWithoutReportInput, RevisionCommentUncheckedCreateWithoutReportInput>
  }

  export type RevisionCommentUpdateWithWhereUniqueWithoutReportInput = {
    where: RevisionCommentWhereUniqueInput
    data: XOR<RevisionCommentUpdateWithoutReportInput, RevisionCommentUncheckedUpdateWithoutReportInput>
  }

  export type RevisionCommentUpdateManyWithWhereWithoutReportInput = {
    where: RevisionCommentScalarWhereInput
    data: XOR<RevisionCommentUpdateManyMutationInput, RevisionCommentUncheckedUpdateManyWithoutReportInput>
  }

  export type RevisionCommentScalarWhereInput = {
    AND?: RevisionCommentScalarWhereInput | RevisionCommentScalarWhereInput[]
    OR?: RevisionCommentScalarWhereInput[]
    NOT?: RevisionCommentScalarWhereInput | RevisionCommentScalarWhereInput[]
    id?: StringFilter<"RevisionComment"> | string
    content?: StringFilter<"RevisionComment"> | string
    authorId?: StringFilter<"RevisionComment"> | string
    reportId?: StringFilter<"RevisionComment"> | string
    createdAt?: DateTimeFilter<"RevisionComment"> | Date | string
  }

  export type RevisionReportCreateWithoutCommentsInput = {
    id?: string
    projectName: string
    issueType?: string
    description?: string | null
    progress?: string
    approval?: string
    approvalNote?: string | null
    senderRole: string
    targetRole: string
    targetUserId?: string | null
    sentById?: string | null
    attachmentName?: string | null
    attachmentUrl?: string | null
    attachmentData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RevisionReportUncheckedCreateWithoutCommentsInput = {
    id?: string
    projectName: string
    issueType?: string
    description?: string | null
    progress?: string
    approval?: string
    approvalNote?: string | null
    senderRole: string
    targetRole: string
    targetUserId?: string | null
    sentById?: string | null
    attachmentName?: string | null
    attachmentUrl?: string | null
    attachmentData?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RevisionReportCreateOrConnectWithoutCommentsInput = {
    where: RevisionReportWhereUniqueInput
    create: XOR<RevisionReportCreateWithoutCommentsInput, RevisionReportUncheckedCreateWithoutCommentsInput>
  }

  export type RevisionReportUpsertWithoutCommentsInput = {
    update: XOR<RevisionReportUpdateWithoutCommentsInput, RevisionReportUncheckedUpdateWithoutCommentsInput>
    create: XOR<RevisionReportCreateWithoutCommentsInput, RevisionReportUncheckedCreateWithoutCommentsInput>
    where?: RevisionReportWhereInput
  }

  export type RevisionReportUpdateToOneWithWhereWithoutCommentsInput = {
    where?: RevisionReportWhereInput
    data: XOR<RevisionReportUpdateWithoutCommentsInput, RevisionReportUncheckedUpdateWithoutCommentsInput>
  }

  export type RevisionReportUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    issueType?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: StringFieldUpdateOperationsInput | string
    approval?: StringFieldUpdateOperationsInput | string
    approvalNote?: NullableStringFieldUpdateOperationsInput | string | null
    senderRole?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableStringFieldUpdateOperationsInput | string | null
    sentById?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevisionReportUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    issueType?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: StringFieldUpdateOperationsInput | string
    approval?: StringFieldUpdateOperationsInput | string
    approvalNote?: NullableStringFieldUpdateOperationsInput | string | null
    senderRole?: StringFieldUpdateOperationsInput | string
    targetRole?: StringFieldUpdateOperationsInput | string
    targetUserId?: NullableStringFieldUpdateOperationsInput | string | null
    sentById?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentName?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    attachmentData?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevisionCommentCreateManyReportInput = {
    id?: string
    content: string
    authorId: string
    createdAt?: Date | string
  }

  export type RevisionCommentUpdateWithoutReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevisionCommentUncheckedUpdateWithoutReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevisionCommentUncheckedUpdateManyWithoutReportInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}