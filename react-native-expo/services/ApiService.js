import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL configuration similar to Flutter app
const getBaseUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'web') {
      return 'http://localhost:8000';
    } else {
      return 'http://10.0.2.2:8000'; // Android emulator
    }
  } else {
    // Production mode
    return 'https://life-automation-api-1050310982145.europe-west2.run.app';
  }
};

class ApiService {
  constructor() {
    this.baseURL = getBaseUrl();
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 60000, // 60 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include Firebase Auth token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;
          if (user) {
            const idToken = await user.getIdToken();
            config.headers.Authorization = `Bearer ${idToken}`;
          }
        } catch (error) {
          console.error('Error getting Firebase token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout - please try again');
        }
        
        if (error.response) {
          // Server responded with error status
          throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
          // Network error
          throw new Error('Network Error: Unable to connect to server');
        } else {
          throw new Error('Request Error: ' + error.message);
        }
      }
    );
  }

  /**
   * Generic request method
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method
   * @param {Object} payload - Request payload
   * @param {Function} onError - Error callback function
   * @returns {Promise} API response data
   */
  async request(endpoint, method = 'GET', payload = null, onError = null) {
    try {
      const config = {
        method: method.toLowerCase(),
        url: endpoint,
      };

      if (payload && ['post', 'put', 'patch'].includes(method.toLowerCase())) {
        config.data = payload;
      }

      const response = await this.axiosInstance(config);
      return response.data;
    } catch (error) {
      if (onError) {
        onError(error.message);
      }
      throw error;
    }
  }

  /**
   * Load all data for a specific date (equivalent to Flutter's loadAll)
   * @param {string} currentDate - Date in YYYY-MM-DD format
   * @param {Function} onError - Error callback function
   * @returns {Promise<Object>} Object containing routines, exercises, and meals
   */
  async loadAll(currentDate, onError = null) {
    try {
      const endpoint = `quentin-duverge/routines/${currentDate}`;
      const result = await this.request(endpoint, 'GET', null, onError);
      
      return {
        routines: result.routines,
        exercises: result.exercises,
        meals: result.meals,
      };
    } catch (error) {
      console.error('Error in loadAll:', error);
      if (onError) {
        onError(error.message);
      }
      throw error;
    }
  }

  /**
   * Update a document
   * @param {string} collection - Collection name
   * @param {string} id - Document ID
   * @param {Object} data - Document data
   * @param {Function} onError - Error callback function
   * @returns {Promise} API response
   */
  async updateDocument(collection, id, data, onError = null) {
    try {
      const endpoint = `quentin-duverge/${collection}/${id}`;
      return await this.request(endpoint, 'POST', data, onError);
    } catch (error) {
      console.error('Error updating document:', error);
      if (onError) {
        onError(error.message);
      }
      throw error;
    }
  }

  /**
   * Build items for a specific collection and day
   * @param {string} collection - Collection name
   * @param {string} day - Day identifier
   * @param {Function} onError - Error callback function
   * @returns {Promise} API response
   */
  async buildItems(collection, day, onError = null) {
    try {
      const endpoint = `quentin-duverge/build-items/${collection}/${day}`;
      return await this.request(endpoint, 'POST', {}, onError);
    } catch (error) {
      console.error('Error building items:', error);
      if (onError) {
        onError(error.message);
      }
      throw error;
    }
  }
}

// Export singleton instance
export default new ApiService();
