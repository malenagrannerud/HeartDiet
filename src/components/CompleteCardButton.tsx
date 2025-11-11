import { useNavigate } from 'react-router-dom';
import { markCardCompleted } from '@/lib/card-completion';
import { type CardId } from '@/lib/schemas';

interface CompleteCardButtonProps {
  cardId: CardId;
  className?: string;
}

export const CompleteCardButton = ({ cardId, className }: CompleteCardButtonProps) => {
  const navigate = useNavigate();
  
  const handleComplete = () => {
    markCardCompleted(cardId);
    navigate('/app/today');
  };

  return (
    <button onClick={handleComplete} className={className}>
      Spara och avsluta
    </button>
  );
};