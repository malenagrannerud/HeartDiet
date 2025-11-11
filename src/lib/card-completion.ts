import { getStorageItem, setStorageItem } from './storage';
import { cardCompletionsSchema, type CardId, type CardCompletion } from './schemas';

// Re-export types
export type { CardId, CardCompletion };

const COMPLETED_CARDS_KEY = 'completedCards';

export const getCompletedCards = (): CardCompletion[] => {
  return getStorageItem(COMPLETED_CARDS_KEY, cardCompletionsSchema) || [];
};

export const markCardCompleted = (cardId: CardId): boolean => {
  console.log('markCardCompleted called with:', cardId);
  const completedCards = getCompletedCards();
  const today = new Date().toISOString().split('T')[0];
  
  console.log('Current completedCards:', completedCards);
  console.log('Today:', today);
  
  // Remove any existing completion for this card today and add new one
  const filteredCards = completedCards.filter(
    card => !(card.cardId === cardId && card.completedDate === today)
  );
  
  const updatedCards = [
    ...filteredCards,
    { cardId, completedDate: today }
  ];
  
  console.log('Updated cards to save:', updatedCards);
  const result = setStorageItem(COMPLETED_CARDS_KEY, updatedCards, cardCompletionsSchema);
  console.log('setStorageItem result:', result);
  
  return result;
};

export const isCardCompletedToday = (cardId: CardId): boolean => {
  const completedCards = getCompletedCards();
  const today = new Date().toISOString().split('T')[0];
  return completedCards.some(card => card.cardId === cardId && card.completedDate === today);
};

export const wasCardCompletedOnDifferentDay = (cardId: CardId): boolean => {
  const completedCards = getCompletedCards();
  const today = new Date().toISOString().split('T')[0];
  const completion = completedCards.find(card => card.cardId === cardId);
  return completion ? completion.completedDate !== today : false;
};

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

export const getCardsToHide = (): Record<CardId, boolean> => {
  return {
    'tutorial': wasCardCompletedOnDifferentDay('tutorial'),
    'health-priorities': wasCardCompletedOnDifferentDay('health-priorities'),
    'health-metrics': wasCardCompletedOnDifferentDay('health-metrics'),
  };
};