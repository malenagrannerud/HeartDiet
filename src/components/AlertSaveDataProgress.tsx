// components/SaveConfirmationDialog.tsx
import React from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface HealthEntryData {
  date?: string | Date;
  type: 'weight' | 'bloodPressure' | 'bloodFats' | 'bloodGlucose';
  weight?: string;
  systolic?: string;
  diastolic?: string;
  ldl?: string;
  hdl?: string;
  triglycerides?: string;
  hba1c?: string;
  fastingGlucose?: string;
}

interface SaveConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingEntry: HealthEntryData | null;
  selectedDate?: Date | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SaveConfirmationDialog({
  open,
  onOpenChange,
  pendingEntry,
  selectedDate,
  onConfirm,
  onCancel,
}: SaveConfirmationDialogProps) {
  const renderEntryDetails = () => {
    if (!pendingEntry) return null;

    return (
      <div className="my-4 space-y-3 bg-muted/50 p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Datum:</span>
          <span className="text-sm font-medium">
            {pendingEntry.date 
              ? format(new Date(pendingEntry.date), 'd MMMM yyyy', { locale: sv })
              : selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: sv })
            }
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Typ:</span>
          <span className="text-sm font-medium">
            {pendingEntry.type === 'weight' && 'Vikt'}
            {pendingEntry.type === 'bloodPressure' && 'Blodtryck'}
            {pendingEntry.type === 'bloodFats' && 'Kolesterolvärden'}
            {pendingEntry.type === 'bloodGlucose' && 'Blodsockervärden'}
          </span>
        </div>
        
        {pendingEntry.type === 'weight' && pendingEntry.weight && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Värde:</span>
            <span className="text-sm font-medium">{pendingEntry.weight} kg</span>
          </div>
        )}
        
        {pendingEntry.type === 'bloodPressure' && pendingEntry.systolic && pendingEntry.diastolic && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Värde:</span>
            <span className="text-sm font-medium">{pendingEntry.systolic}/{pendingEntry.diastolic} mmHg</span>
          </div>
        )}
        
        {pendingEntry.type === 'bloodFats' && (
          <>
            {pendingEntry.ldl && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">LDL:</span>
                <span className="text-sm font-medium">{pendingEntry.ldl} mmol/L</span>
              </div>
            )}
            {pendingEntry.hdl && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">HDL:</span>
                <span className="text-sm font-medium">{pendingEntry.hdl} mmol/L</span>
              </div>
            )}
            {pendingEntry.triglycerides && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Triglycerider:</span>
                <span className="text-sm font-medium">{pendingEntry.triglycerides} mmol/L</span>
              </div>
            )}
          </>
        )}
        
        {pendingEntry.type === 'bloodGlucose' && (
          <>
            {pendingEntry.hba1c && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">HbA1c:</span>
                <span className="text-sm font-medium">{pendingEntry.hba1c} mmol/mol</span>
              </div>
            )}
            {pendingEntry.fastingGlucose && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Fasteblodsocker:</span>
                <span className="text-sm font-medium">{pendingEntry.fastingGlucose} mmol/L</span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Granska innan du sparar</AlertDialogTitle>
          <AlertDialogDescription>
            Kontrollera att uppgifterna stämmer:
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {renderEntryDetails()}
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Avbryt
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Spara
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}