/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as alerts from "../alerts.js";
import type * as applications from "../applications.js";
import type * as auth from "../auth.js";
import type * as cron from "../cron.js";
import type * as cronActions from "../cronActions.js";
import type * as feeds from "../feeds.js";
import type * as http from "../http.js";
import type * as notify from "../notify.js";
import type * as opportunities from "../opportunities.js";
import type * as predictions from "../predictions.js";
import type * as scrape from "../scrape.js";
import type * as seed from "../seed.js";
import type * as studio from "../studio.js";
import type * as users from "../users.js";
import type * as visa from "../visa.js";
import type * as watchlist from "../watchlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  alerts: typeof alerts;
  applications: typeof applications;
  auth: typeof auth;
  cron: typeof cron;
  cronActions: typeof cronActions;
  feeds: typeof feeds;
  http: typeof http;
  notify: typeof notify;
  opportunities: typeof opportunities;
  predictions: typeof predictions;
  scrape: typeof scrape;
  seed: typeof seed;
  studio: typeof studio;
  users: typeof users;
  visa: typeof visa;
  watchlist: typeof watchlist;
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
