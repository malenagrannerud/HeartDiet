// components/UserPlanForm.tsx
import React, { useState } from 'react';
import { UserPlan } from '@/data/tipCardColorsText'; // Import from src/data/tips.ts
import { bodyTextBald } from '@/lib/design-tokens';
import { sectionHeading2} from '@/lib/design-tokens';

interface UserPlanFormProps {
  tipId: number;
  initialPlan?: UserPlan;
  onSave: (plan: UserPlan) => void;
  onCancel: () => void;
}

export const UserPlanForm: React.FC<UserPlanFormProps> = ({
  tipId,
  initialPlan,
  onSave,
  onCancel
}) => {
  const [plan, setPlan] = useState<UserPlan>(
    initialPlan || { goal: '', when: '', how: '', reminder: '' }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plan.goal.trim() && plan.when.trim() && plan.how.trim() && plan.reminder.trim()) {
      onSave(plan);
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 mt-6 rounded-none">
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className={bodyTextBald}>Mål</label>
          <input
            type="text"
            value={plan.goal}
            onChange={(e) => setPlan({ ...plan, goal: e.target.value })}
            placeholder="Ex: Äta två nävar bär, äta en frukt, äta en näve sallad..."
            className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className={bodyTextBald}>När?</label>
          <input
            type="text"
            value={plan.when}
            onChange={(e) => setPlan({ ...plan, when: e.target.value })}
            placeholder="Ex: Frukost, lunch, mellanmål, middag..."
            className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className={bodyTextBald}>
            Hur?
          </label>
          <textarea
            value={plan.how}
            onChange={(e) => setPlan({ ...plan, how: e.target.value })}
            placeholder="Ex: Jag ska handla grönsaker på söndag och förbereda fruktsallad till hela veckan..."
            rows={4}
            className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className={bodyTextBald}>Påminnelse</label>
          <input
            type="text"
            value={plan.reminder}
            onChange={(e) => setPlan({ ...plan, reminder: e.target.value })}
            placeholder="Ex: Sätt alarm, handla på söndag, förbereda kvällen innan..."
            className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Spara 
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Avbryt
          </button>
        </div>
      </form>
    </div>
  );
};
