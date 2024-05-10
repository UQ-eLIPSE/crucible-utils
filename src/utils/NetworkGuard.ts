import { DataMCQOptions, DataMCQuestion } from "@/types/DataMCQ";

/**
 * A helper module function that validates the structure of primitives and objects
 */
const validate = (() => {
  const isString = (str: unknown): str is string => typeof str === "string";

  const isObject = (obj: unknown): obj is Record<string, unknown> => {
    return typeof obj === "object" && obj !== null;
  };

  const isBoolean = (bool: unknown): bool is boolean =>
    typeof bool === "boolean";

  const isArray = <T>(
    arr: unknown,
    check: (item: unknown) => item is T,
  ): arr is T[] => {
    return Array.isArray(arr) && arr.every(check);
  };

  const isNumber = (num: unknown): num is number => {
    return typeof num === "number";
  };

  const isFunction = (func: unknown): func is Function => {
    return typeof func === "function";
  };

  return {
    isString,
    isObject,
    isBoolean,
    isArray,
    isNumber,
    isFunction,
  };
})();

/**
 * Validates the tags for a question
 * Three types of tags:
 * 1. Taxonomy: (i.e. Course: VETHUB2011)
 * 2. Search tags: (i.e. Animal_Being) NO SPACES
 * TODO: Decide on the format of the directives and its purpose
 * 3. Directives: (i.e. !!EXCLUDE!!)
 * NOTE: Tags w/ spaces will count as invalid. Use underscores instead. i.e. "SEM 1" should be "SEM_1"
 * @param tag string to validate
 * @returns {boolean}
 */
function isTag(tag: string): boolean {
  const isTaxonomy = tag.includes(":") && tag.split(":").length === 2;
  const isSearchTag = !tag.includes(":") && tag.trim().split(" ").length === 1;
  return isTaxonomy || isSearchTag;
}

function validateTags(arr: unknown, checkAll: boolean = false): boolean {
  if (!validate.isArray(arr, validate.isString)) {
    return false;
  }

  return checkAll ? arr.every(isTag) : arr.some(isTag);
}

function isMCQOptions(obj: unknown): obj is DataMCQOptions {
  return (
    validate.isObject(obj) &&
    validate.isString(obj.optionValue) &&
    (obj.optionCorrect === undefined || validate.isBoolean(obj.optionCorrect))
  );
}

function isMCQuestion(obj: unknown): obj is DataMCQuestion {
  return (
    validate.isObject(obj) &&
    validate.isObject(obj._id) &&
    validate.isString(obj._id.$oid) &&
    validate.isString(obj.statement) &&
    validateTags(obj.tags, false) &&
    validate.isArray(obj.optionsList, isMCQOptions) &&
    validate.isString(obj.link)
  );
}

function isMCQuestionArray(obj: unknown): obj is DataMCQuestion[] {
  return validate.isArray(obj, isMCQuestion);
}

/**
 * Used to help collect the info of invalid data in the warn logs
 */
export interface InvalidDataQsLogs {
  invalidTags: number;
  noTags: number;
  invalidQs: number;
  totalTags: number;
}

export default {
  isMCQuestion,
  isMCQuestionArray,
  validateTags,
  isTag,
};
