/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import { anyApi } from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api = {
  rooms: {
    createRoom: "rooms:createRoom",
    getPlayersInRoom: "rooms:getPlayersInRoom",
    getRoom: "rooms:getRoom",
    getRoomByCode: "rooms:getRoomByCode",
    joinRoom: "rooms:joinRoom",
    setPlayerReady: "rooms:setPlayerReady",
    startGame: "rooms:startGame"
  },
  users: {
    // User related functions will go here
  }
};
export const internal = anyApi;
