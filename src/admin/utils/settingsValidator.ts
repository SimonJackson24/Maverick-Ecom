import { ValidationRule, SettingsValidation, SETTINGS_VALIDATION } from '../types/settings';

export class SettingsValidator {
  private static EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static PHONE_REGEX = /^\+?[\d\s-()]{10,}$/;

  static validate(path: string, value: any): string[] {
    const rules = SETTINGS_VALIDATION[path];
    if (!rules) return [];

    const errors: string[] = [];
    rules.forEach((rule) => {
      const error = this.validateRule(rule, value);
      if (error) errors.push(error);
    });

    return errors;
  }

  private static validateRule(rule: ValidationRule, value: any): string | null {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && !value.trim())) {
          return rule.message;
        }
        break;

      case 'email':
        if (value && !this.EMAIL_REGEX.test(value)) {
          return rule.message;
        }
        break;

      case 'phone':
        if (value && !this.PHONE_REGEX.test(value)) {
          return rule.message;
        }
        break;

      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          return rule.message;
        }
        if (rule.min !== undefined && num < rule.min) {
          return `Value must be at least ${rule.min}`;
        }
        if (rule.max !== undefined && num > rule.max) {
          return `Value must be at most ${rule.max}`;
        }
        break;

      case 'url':
        try {
          if (value) {
            new URL(value);
          }
        } catch {
          return rule.message;
        }
        break;

      case 'custom':
        if (rule.customValidator && !rule.customValidator(value)) {
          return rule.message;
        }
        if (typeof value === 'string') {
          if (rule.min !== undefined && value.length < rule.min) {
            return `Must be at least ${rule.min} characters`;
          }
          if (rule.max !== undefined && value.length > rule.max) {
            return `Must be at most ${rule.max} characters`;
          }
          if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
            return rule.message;
          }
        }
        break;
    }

    return null;
  }

  static validateAll(settings: any): { [key: string]: string[] } {
    const errors: { [key: string]: string[] } = {};

    // Recursively validate all settings
    const validateObject = (obj: any, parentPath: string = '') => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = parentPath ? `${parentPath}.${key}` : key;

        // If value is an object, recurse
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          validateObject(value, currentPath);
        }

        // Validate current path
        const pathErrors = this.validate(currentPath, value);
        if (pathErrors.length > 0) {
          errors[currentPath] = pathErrors;
        }
      });
    };

    validateObject(settings);
    return errors;
  }

  static hasErrors(errors: { [key: string]: string[] }): boolean {
    return Object.keys(errors).length > 0;
  }

  static getErrorsForSection(
    errors: { [key: string]: string[] },
    section: string
  ): { [key: string]: string[] } {
    const sectionErrors: { [key: string]: string[] } = {};
    Object.entries(errors).forEach(([path, messages]) => {
      if (path.startsWith(section)) {
        sectionErrors[path] = messages;
      }
    });
    return sectionErrors;
  }
}
