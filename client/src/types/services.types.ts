/**
 * Type definitions for board service operations
 */

import type { BoardData, NewBoardData } from '@/types/board.types';

/**
 * Interface for the board service API
 */
export interface BoardServiceInterface {
  /**
   * Get all boards for the current user
   * @param token Authentication token
   * @returns Promise with array of boards
   */
  getAllBoards: (token?: string) => Promise<BoardData[]>;

  /**
   * Get board details by ID
   * @param boardId ID of the board to retrieve
   * @param token Authentication token
   * @returns Promise with board data
   */
  getBoardDetails: (boardId: string, token?: string) => Promise<BoardData>;

  /**
   * Create a new board
   * @param boardData Data for the new board
   * @param token Authentication token
   * @returns Promise with created board data
   */
  createBoard: (boardData: NewBoardData, token?: string) => Promise<BoardData>;

  /**
   * Update existing board
   * @param boardId ID of the board to update
   * @param boardData Data to update
   * @param token Authentication token
   * @returns Promise with updated board data
   */
  updateBoard: (boardId: string, boardData: Partial<BoardData>, token?: string) => Promise<BoardData>;

  /**
   * Delete a board
   * @param boardId ID of the board to delete
   * @param token Authentication token
   * @returns Promise with success status
   */
  deleteBoard: (boardId: string, token?: string) => Promise<boolean>;

}
