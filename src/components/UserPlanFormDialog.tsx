import React from 'react';
import { UserPlan } from '@/data/tipCardColorsText';
import { UserPlanForm } from './UserPlanForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { sectionHeading2 } from '@/lib/design-tokens';

interface UserPlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipId: number;
  initialPlan?: UserPlan;
  onSave: (plan: UserPlan) => void;
  onCancel: () => void;
}

export const UserPlanFormDialog: React.FC<UserPlanFormDialogProps> = ({
  open,
  onOpenChange,
  tipId,
  initialPlan,
  onSave,
  onCancel
}) => {
  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const handleSave = (plan: UserPlan) => {
    onSave(plan);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={sectionHeading2}>
            {initialPlan ? 'Redigera plan' : 'Lägg till plan'}
          </DialogTitle>
        </DialogHeader>
        <UserPlanForm
          tipId={tipId}
          initialPlan={initialPlan}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
