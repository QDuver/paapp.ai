import { IFieldMetadata } from "../models/Abstracts";

export const fieldConverter = {
  string: (value: string) => value,
  number: (value: string) => {
    const numValue = Number(value);
    return isNaN(numValue) ? 0 : numValue;
  },
  boolean: (value: string) => value === "true",
};

export const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Utility functions for form data handling
export const FormDataUtils = {
  toFormData: (instance: any, getEditableFields: () => IFieldMetadata<any>[]): { [key: string]: any } => {
    const formData: { [key: string]: any } = {};
    getEditableFields().forEach(fieldMetadata => {
      const fieldName = fieldMetadata.field;
      const value = instance[fieldName];
      formData[fieldName] = value;
    });
    return formData;
  },

  fromFormData: (formData: { [key: string]: any }, getEditableFields: () => IFieldMetadata<any>[]): { [key: string]: any } => {
    const convertedData: { [key: string]: any } = {};
    getEditableFields().forEach(fieldMetadata => {
      const fieldName = fieldMetadata.field;
      if (formData.hasOwnProperty(fieldName)) {
        const rawValue = formData[fieldName];
        const stringValue = rawValue === null || rawValue === undefined ? "" : rawValue.toString();
        convertedData[fieldName] = fieldMetadata.converter ? fieldMetadata.converter(stringValue) : stringValue;
      }
    });
    return convertedData;
  },
};
