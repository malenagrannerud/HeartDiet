// components/UserPlanDisplay.tsx
// src/components/UserPlanDisplay.tsx
import React from 'react';
import { UserPlan } from '@/data/tips';
import { bodyText } from '@/lib/design-tokens';
import { bodyTextBald } from '@/lib/design-tokens';


interface UserPlanDisplayProps {
  plan: UserPlan;
  onEdit: () => void;
  onDelete: () => void;
}

export const UserPlanDisplay: React.FC<UserPlanDisplayProps> = ({
  plan,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className={bodyTextBald}>Min sparade plan ✅</h3>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Redigera
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Ta bort
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <span className={bodyTextBald}>När: </span>
          <span className={bodyText}>{plan.when}</span>
        </div>
        
        <div>
          <span className={bodyTextBald}>Hur: </span>
          <span className={bodyText}>{plan.how}</span>
        </div>
      </div>
    </div>
  );
};