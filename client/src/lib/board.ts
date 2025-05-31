/**
 * Utility functions for board operations
 */
import type { BoardData, BoardSortOption } from '@/types/board.types';
import { BOARD_SORT_OPTIONS, DEFAULT_BOARD_COLOR } from '@/constants/board';

/**
 * Filters and sorts boards based on search query and sort option
 * 
 * @param boards - List of boards to filter and sort
 * @param searchQuery - Search query to filter boards
 * @param sortOption - Option for sorting the boards
 * @returns Filtered and sorted boards
 */
export function filterAndSortBoards(
  boards: BoardData[],
  searchQuery: string,
  sortOption: BoardSortOption
): BoardData[] {
  // Filter by search query
  let filtered = boards;
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = boards.filter(board => 
      board.title.toLowerCase().includes(query) || 
      (board.description && board.description.toLowerCase().includes(query))
    );
  }
  
  // Apply sort
  return [...filtered].sort((a, b) => {
    switch (sortOption) {
      case BOARD_SORT_OPTIONS.NEWEST:
        return b.createdAt.getTime() - a.createdAt.getTime();
      case BOARD_SORT_OPTIONS.OLDEST:
        return a.createdAt.getTime() - b.createdAt.getTime();
      case BOARD_SORT_OPTIONS.NAME_ASC:
        return a.title.localeCompare(b.title);
      case BOARD_SORT_OPTIONS.NAME_DESC:
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
}

/**
 * Formats welcome message with username
 * 
 * @param message - Message template containing {username} placeholder
 * @param username - Username to insert in the message
 * @param fallback - Fallback name if username is not available
 * @returns Formatted welcome message
 */
export function formatWelcomeMessage(
  message: string,
  username: string | null,
  fallback: string
): string {
  return message.replace('{username}', username || fallback);
}

/**
 * Initializes a new board form data with default values
 * 
 * @returns Initial board form data
 */
export function initializeBoardFormData(): {
  title: string;
  description: string;
  backgroundColor: string;
} {
  return {
    title: "",
    description: "",
    backgroundColor: DEFAULT_BOARD_COLOR,
  };
}

/**
 * Finds a board by ID in a list of boards
 * 
 * @param boards - List of boards to search in
 * @param boardId - ID of the board to find
 * @returns The found board or null if not found
 */
export function findBoardById(boards: BoardData[], boardId: string): BoardData | null {
  return boards.find((board) => board.id === boardId) || null;
}
