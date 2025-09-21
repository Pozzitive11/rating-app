/**
  Gets the value of a property on an object.

  ```javascript
  get(obj, "name");
  ```

  Note that if the object itself is `undefined`, this method will throw an error.

  @param {Object} obj The object to retrieve from.
  @param {String} keyName The property key to retrieve
  @return {Object} the property value or `null`.
*/
function get<T extends object, K extends keyof T>(
  obj: T,
  keyName: K
): T[K];
function get(obj: unknown, keyName: string): unknown;
function get(obj: unknown, keyName: string): unknown {
  return _getProp(obj, keyName);
}

function _getProp(obj: unknown, keyName: string) {
  if (obj == null) {
    return;
  }

  let value: unknown;

  if (
    typeof obj === "object" ||
    typeof obj === "function"
  ) {
    value = (obj as any)[keyName];
  }

  return value;
}

/**
  Verifies that a value is `null` or `undefined`, an empty string, or an empty
  array.

  Constrains the rules on `isNone` by returning true for empty strings and
  empty arrays.

  If the value is an object with a `size` property of type number, it is used
  to check emptiness.

  ```javascript
  isEmpty(null);             // true
  isEmpty(undefined);        // true
  isEmpty('');               // true
  isEmpty([]);               // true
  isEmpty({ size: 0});       // true
  isEmpty({});               // false
  isEmpty('Adam Hawkins');   // false
  isEmpty([0,1,2]);          // false
  isEmpty('\n\t');           // false
  isEmpty('  ');             // false
  isEmpty({ size: 1 })       // false
  isEmpty({ size: () => 0 }) // false
  ```

  @param {Object} obj Value to test
  @return {Boolean}
*/
export function isEmpty(obj: unknown): boolean {
  if (obj === null || obj === undefined) {
    return true;
  }

  // Check for empty object
  if (
    typeof obj === "object" &&
    obj !== null &&
    Object.keys(obj).length === 0 &&
    Object.getPrototypeOf(obj) === Object.prototype
  ) {
    return true;
  }

  if (typeof (obj as HasSize).size === "number") {
    return !(obj as HasSize).size;
  }

  if (typeof obj === "object") {
    let size = get(obj, "size");
    if (typeof size === "number") {
      return !size;
    }
    let length = get(obj, "length");
    if (typeof length === "number") {
      return !length;
    }
  }

  if (
    typeof (obj as HasLength).length === "number" &&
    typeof obj !== "function"
  ) {
    return !(obj as HasLength).length;
  }

  return false;
}

export default isEmpty;

interface HasSize {
  size: number;
}

interface HasLength {
  length: number;
}
