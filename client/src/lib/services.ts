/**
 * Service adapters for consistent API handling
 */

import { boardService } from '@/services/boardService';

import type { BoardData, NewBoardData } from '@/types/board.types';

/**
 * Board services with additional error handling and transformations
 */
export const BoardService = {
  /**
   * Get all boards with proper error handling
   */
  async getAllBoards(): Promise<{ data: BoardData[], error: string | null }> {
    try {
      const data = await boardService.getAllBoards();
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching boards:', error);
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Failed to fetch boards' 
      };
    }
  },
  
  /**
   * Create a new board with proper error handling
   */
  async createBoard(boardData: NewBoardData): Promise<{ data: BoardData | null, error: string | null }> {
    try {
      const data = await boardService.createBoard(boardData);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating board:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to create board' 
      };
    }
  },
  
  /**
   * Delete a board with proper error handling
   */
  async deleteBoard(boardId: string): Promise<{ success: boolean, error: string | null }> {
    try {
      const success = await boardService.deleteBoard(boardId);
      return { success, error: null };
    } catch (error) {
      console.error('Error deleting board:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete board' 
      };
    }
  }
};
