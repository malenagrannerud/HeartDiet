import React from 'react';
import { UserPlan } from '@/data/tips';
import { bodyTextBald } from '@/lib/design-tokens';
import { Trash2, Edit2 } from 'lucide-react';

interface UserPlanDisplayProps {
  plans: UserPlan[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const UserPlanDisplay: React.FC<UserPlanDisplayProps> = ({
  plans,
  onEdit,
  onDelete
}) => {
  return (
    <div className="space-y-4 mt-6">
      {plans.map((plan, index) => (
        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <h3 className={`${bodyTextBald} flex items-center gap-2`}>
              Min sparade plan {plans.length > 1 && `${index + 1}`} ✅
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(index)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                aria-label="Redigera plan"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(index)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                aria-label="Ta bort plan"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className={bodyTextBald}>Mål: </span>
              <span className="font-handwritten text-xl">{plan.goal}</span>
            </div>

            <div>
              <span className={bodyTextBald}>När: </span>
              <span className="font-handwritten text-xl">{plan.when}</span>
            </div>
            
            <div>
              <span className={bodyTextBald}>Hur: </span>
              <span className="font-handwritten text-xl">{plan.how}</span>
            </div>

            <div>
              <span className={bodyTextBald}>Påminnelse: </span>
              <span className="font-handwritten text-xl">{plan.reminder}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
