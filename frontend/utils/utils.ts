import { IFieldMetadata } from "../models/Abstracts";
import { DEV_CONFIG, PROD_CONFIG } from "../config/env";
import { Alert, Platform } from "react-native";

const testConnection = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    
    await fetch(`${url}/health`, { 
      method: 'HEAD',
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
};

export const getBaseUrl = async (): Promise<string> => {
  if (__DEV__) {
    const localUrl = Platform.OS === "web"
      ? `http://localhost:${DEV_CONFIG.LOCAL_PORT}`
      : `http://${DEV_CONFIG.LOCAL_IP}:${DEV_CONFIG.LOCAL_PORT}`;
    
    const isLocalAvailable = await testConnection(localUrl);
    console.log("Local server availability:", isLocalAvailable);
    return isLocalAvailable ? localUrl : PROD_CONFIG.API_URL;

  } else {
    return PROD_CONFIG.API_URL;
  }
};

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
  toFormData: (instance: any, getEditableFields: () => IFieldMetadata[]): { [key: string]: any } => {
    const formData: { [key: string]: any } = {};
    getEditableFields().forEach(fieldMetadata => {
      const fieldName = fieldMetadata.field;
      const value = instance[fieldName];
      formData[fieldName] = value;
    });
    return formData;
  },

  fromFormData: (formData: { [key: string]: any }, getEditableFields: () => IFieldMetadata[]): { [key: string]: any } => {
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
