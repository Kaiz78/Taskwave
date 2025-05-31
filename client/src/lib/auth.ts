/**
 * Utility functions for authentication-related operations
 */

/**
 * Gets the authentication token from local storage
 * @returns The authentication token or undefined if not found
 */
export function getAuthToken(): string | undefined {
  try {
    const authStore = localStorage.getItem('auth-storage');
    if (!authStore) return undefined;
    
    const parsedStore = JSON.parse(authStore);
    return parsedStore.state?.token || undefined;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return undefined;
  }
}
