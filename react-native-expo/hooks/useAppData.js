import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import ApiService from '../services/ApiService';
import { getCurrentDate } from '../utils/dateUtils';

/**
 * Custom hook to manage app data and loading state
 * @returns {Object} Hook state and methods
 */
export const useAppData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    routines: null,
    exercises: null,
    meals: null,
  });
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [error, setError] = useState(null);

  /**
   * Show error message to user
   * @param {string} message - Error message to display
   */
  const showError = useCallback((message) => {
    setError(message);
    Alert.alert('Error', message, [
      { text: 'OK', onPress: () => setError(null) }
    ]);
  }, []);

  /**
   * Load all data for the current date
   */
  const loadAllData = useCallback(async () => {
    if (isLoading) return; // Prevent multiple simultaneous requests
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading data for date:', currentDate);
      const result = await ApiService.loadAll(currentDate, showError);
      
      setData({
        routines: result.routines,
        exercises: result.exercises,
        meals: result.meals,
      });
      
      console.log('Data loaded successfully:', {
        routines: result.routines?.items?.length || 0,
        exercises: result.exercises?.items?.length || 0,
        meals: result.meals?.items?.length || 0,
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      showError(error.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, isLoading, showError]);

  /**
   * Update document in the backend
   * @param {string} collection - Collection name
   * @param {Object} item - Item to update
   */
  const updateDocument = useCallback(async (collection, item) => {
    if (!item.id) {
      showError('Cannot update item without ID');
      return;
    }

    setIsLoading(true);
    try {
      await ApiService.updateDocument(collection, item.id, item, showError);
      console.log(`Updated ${collection} item:`, item.id);
      
      // Reload data to get updated information
      await loadAllData();
    } catch (error) {
      console.error('Failed to update document:', error);
      showError(error.message || 'Failed to update document');
    } finally {
      setIsLoading(false);
    }
  }, [loadAllData, showError]);

  /**
   * Build items for a specific collection
   * @param {string} collection - Collection name
   */
  const buildItems = useCallback(async (collection) => {
    setIsLoading(true);
    try {
      await ApiService.buildItems(collection, currentDate, showError);
      console.log(`Built items for ${collection} on ${currentDate}`);
      
      // Reload data to get updated information
      await loadAllData();
    } catch (error) {
      console.error('Failed to build items:', error);
      showError(error.message || 'Failed to build items');
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, loadAllData, showError]);

  /**
   * Change the current date and reload data
   * @param {string} newDate - New date in YYYY-MM-DD format
   */
  const changeDate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  // Load data when the component mounts or date changes
  useEffect(() => {
    loadAllData();
  }, [currentDate]); // Only depend on currentDate, not loadAllData to avoid infinite loops

  return {
    // State
    isLoading,
    data,
    currentDate,
    error,
    
    // Actions
    loadAllData,
    updateDocument,
    buildItems,
    changeDate,
    showError,
  };
};
