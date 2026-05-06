// composables/useKoleksiState.js
import { ref } from 'vue';

export const useKoleksiState = () => {
  const searchQuery = ref('');
  
  const setSearchQuery = (query) => {
    searchQuery.value = query;
  };
  
  const getSearchQuery = () => {
    const query = searchQuery.value;
    searchQuery.value = ''; // Clear setelah diambil
    return query;
  };
  
  const clearSearchQuery = () => {
    searchQuery.value = '';
  };
  
  return {
    setSearchQuery,
    getSearchQuery,
    clearSearchQuery
  };
};