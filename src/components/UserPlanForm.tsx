// components/UserPlanForm.tsx
import React, { useState } from 'react';
import { UserPlan } from '@/data/tips'; // Import from src/data/tips.ts
import { bodyText } from '@/lib/design-tokens';
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
    initialPlan || { when: '', how: '', reminder: '' }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plan.when.trim() && plan.how.trim()) {
      onSave(plan);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
      <h3 className={sectionHeading2}> Min plan </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {/* When */}
        <div>
          <label className={`${bodyTextBald} block mb-2`}>
            När?
          </label>
          <input
            type="text"
            value={plan.when}
            onChange={(e) => setPlan({ ...plan, when: e.target.value })}
            placeholder="Ex: Varje morgon, På lördagar, Före lunch..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* How */}
        <div>
          <label className={`${bodyTextBald} block mb-2`}>
            Hur?
          </label>
          <textarea
            value={plan.how}
            onChange={(e) => setPlan({ ...plan, how: e.target.value })}
            placeholder="Beskriv din plan... Ex: Jag ska handla grönsaker på söndag och förbereda fruktsallad till hela veckan..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>


        {/* Buttons */}
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