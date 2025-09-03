/**
 * Field descriptor for dynamic form generation and validation
 * Equivalent to Dart's FieldDescriptor
 */
export class FieldDescriptor<T = any> {
  constructor(
    public name: string,
    public label: string,
    public getter: () => T,
    public setter: (value: T) => void,
    public type: 'string' | 'number' | 'boolean' | 'double'
  ) {}
}

/**
 * Type definitions for better type safety
 */
export type FieldValue = string | number | boolean;
export type FieldMap = Record<string, FieldValue>;

/**
 * Validation utilities
 */
export class ValidationUtils {
  static parseString(value: any): string {
    return String(value || '');
  }

  static parseInt(value: any, fallback: number = 0): number {
    const parsed = parseInt(String(value), 10);
    return isNaN(parsed) ? fallback : parsed;
  }

  static parseFloat(value: any, fallback: number = 0.0): number {
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? fallback : parsed;
  }

  static parseBoolean(value: any): boolean {
    return Boolean(value);
  }
}
