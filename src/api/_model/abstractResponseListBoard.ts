/**
 * Generated by orval v7.2.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import type { Board } from './board';
import type { AbstractResponseListBoardResponseCode } from './abstractResponseListBoardResponseCode';

export interface AbstractResponseListBoard {
  description?: string;
  payload?: Board[];
  responseCode?: AbstractResponseListBoardResponseCode;
}
