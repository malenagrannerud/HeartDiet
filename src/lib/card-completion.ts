import { getStorageItem, setStorageItem } from './storage';
import { cardCompletionsSchema, type CardId, type CardCompletion } from './schemas';
import { getCurrentDate } from './simulated-date';

// Re-export types
export type { CardId, CardCompletion };

const COMPLETED_CARDS_KEY = 'completedCards';

export const getCompletedCards = (): CardCompletion[] => {
  return getStorageItem(COMPLETED_CARDS_KEY, cardCompletionsSchema) || [];
};

export const markCardCompleted = (cardId: CardId): boolean => {
  const completedCards = getCompletedCards();
  const today = getCurrentDate().toISOString().split('T')[0];
  
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

export const isCardCompletedToday = (cardId: CardId): boolean => {
  const completedCards = getCompletedCards();
  const today = getCurrentDate().toISOString().split('T')[0];
  return completedCards.some(card => card.cardId === cardId && card.completedDate === today);
};

export const wasCardCompletedOnDifferentDay = (cardId: CardId): boolean => {
  const completedCards = getCompletedCards();
  const today = getCurrentDate().toISOString().split('T')[0];
  const completion = completedCards.find(card => card.cardId === cardId);
  return completion ? completion.completedDate !== today : false;
};

export const cleanupOldCompletions = (): void => {
  const completedCards = getCompletedCards();
  const sevenDaysAgo = getCurrentDate();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoString = sevenDaysAgo.toISOString().split('T')[0];
  
  const recentCards = completedCards.filter(
    card => card.completedDate >= sevenDaysAgoString
  );
  
  if (recentCards.length < completedCards.length) {
    setStorageItem(COMPLETED_CARDS_KEY, recentCards, cardCompletionsSchema);
  }
};

export const getCardsToHide = (): Record<CardId, boolean> => {
  const completedCards = getCompletedCards();
  const today = getCurrentDate().toISOString().split('T')[0];
  
  return {
    'tutorial': completedCards.some(card => card.cardId === 'tutorial' && card.completedDate !== today),
    'health-goals': completedCards.some(card => card.cardId === 'health-goals' && card.completedDate !== today),
    'medications': completedCards.some(card => card.cardId === 'medications' && card.completedDate !== today),
    'health-metrics': completedCards.some(card => card.cardId === 'health-metrics' && card.completedDate !== today),
  };
};