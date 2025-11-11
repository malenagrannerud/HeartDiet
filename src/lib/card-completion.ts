import { getStorageItem, setStorageItem } from './storage';
import { cardCompletionsSchema, type CardId, type CardCompletion } from './schemas';

// Re-export CardId for convenience
export type { CardId, CardCompletion };

const COMPLETED_CARDS_KEY = 'completedCards';

/**
 * Get all completed cards from storage
 */
export const getCompletedCards = (): CardCompletion[] => {
  return getStorageItem(COMPLETED_CARDS_KEY, cardCompletionsSchema) || [];
};

/**
 * Mark a card as completed for today (only when bottom button is clicked)
 */
export const markCardCompleted = (cardId: CardId): boolean => {
  const completedCards = getCompletedCards();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Remove any existing completion for this card today and add new one
  const filteredCards = completedCards.filter(
    card => !(card.cardId === cardId && card.completedDate === today)
  );
  
  const updatedCards = [
    ...filteredCards,
    { cardId, completedDate: today }
  ];
  
  return setStorageItem(COMPLETED_CARDS_KEY, updatedCards, cardCompletionsSchema);
};

/**
 * Check if a card was completed today (bottom button was clicked)
 */
export const isCardCompletedToday = (cardId: CardId): boolean => {
  const completedCards = getCompletedCards();
  const today = new Date().toISOString().split('T')[0];
  
  return completedCards.some(
    card => card.cardId === cardId && card.completedDate === today
  );
};

/**
 * Check if card was completed on a different day (should be hidden)
 */
export const wasCardCompletedOnDifferentDay = (cardId: CardId): boolean => {
  const completedCards = getCompletedCards();
  const today = new Date().toISOString().split('T')[0];
  
  const completion = completedCards.find(card => card.cardId === cardId);
  return completion ? completion.completedDate !== today : false;
};

/**
 * Clean up old completion records (older than 7 days)
 */
export const cleanupOldCompletions = (): void => {
  const completedCards = getCompletedCards();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoString = sevenDaysAgo.toISOString().split('T')[0];
  
  const recentCards = completedCards.filter(
    card => card.completedDate >= sevenDaysAgoString
  );
  
  if (recentCards.length < completedCards.length) {
    setStorageItem(COMPLETED_CARDS_KEY, recentCards, cardCompletionsSchema);
  }
};

/**
 * Get cards that need to be hidden (completed on previous days)
 */
export const getCardsToHide = (): Record<CardId, boolean> => {
  return {
    'tutorial': wasCardCompletedOnDifferentDay('tutorial'),
    'health-priorities': wasCardCompletedOnDifferentDay('health-priorities'),
    'health-metrics': wasCardCompletedOnDifferentDay('health-metrics'),
  };
};