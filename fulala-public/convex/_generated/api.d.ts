/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as floorPlans from "../floorPlans.js";
import type * as gallery from "../gallery.js";
import type * as media from "../media.js";
import type * as menu from "../menu.js";
import type * as orders from "../orders.js";
import type * as qrCodes from "../qrCodes.js";
import type * as reservations from "../reservations.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as story from "../story.js";
import type * as tables from "../tables.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  categories: typeof categories;
  floorPlans: typeof floorPlans;
  gallery: typeof gallery;
  media: typeof media;
  menu: typeof menu;
  orders: typeof orders;
  qrCodes: typeof qrCodes;
  reservations: typeof reservations;
  seed: typeof seed;
  settings: typeof settings;
  story: typeof story;
  tables: typeof tables;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
