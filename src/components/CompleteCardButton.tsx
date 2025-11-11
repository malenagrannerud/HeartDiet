import { useNavigate } from 'react-router-dom';
import { markCardCompleted } from '@/lib/card-completion';
import { type CardId } from '@/lib/schemas';

interface CompleteCardButtonProps {
  cardId: CardId;
  className?: string;
  children?: React.ReactNode;
}

export const CompleteCardButton = ({ cardId, className = "", children }: CompleteCardButtonProps) => {
  const navigate = useNavigate();
  
  const handleComplete = () => {
    const success = markCardCompleted(cardId);
    if (success) {
      navigate('/app/today');
    }
  };

  return (
    <button 
      onClick={handleComplete} 
      className={className}
    >
      {children || "Spara och avsluta"}
    </button>
  );
};