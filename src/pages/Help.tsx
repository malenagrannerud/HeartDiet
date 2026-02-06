import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Check, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { pageTitle, cardTitle, cardText, interactiveCard, pageContainer, pagePadding } from "@/lib/design-tokens";
import { useAuth } from "@/hooks/use-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  useEffect(() => {
    setTutorialCompleted(localStorage.getItem('tutorialCompleted') === 'true');
  }, []);

  return (
    <div className={`${pageContainer} pb-16`}>
      {/* Header */}
      <header className="px-6 py-8">
        <h1 className={pageTitle}>Hjälp</h1>
      </header>

      <div className={`${pagePadding} space-y-6`}>
        {/* Tutorial Card */}
        <Card 
          className={`${interactiveCard} ${tutorialCompleted ? 'bg-green-50 border-green-200' : ''}`}
          onClick={() => navigate('/app/tutorial')}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className={cardTitle}>Så fungerar appen</h3>
                <p className={cardText}>Läs om hur du använder appen</p>
              </div>
            </div>
            {tutorialCompleted && (
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
            )}
          </div>
        </Card>






        

        {/* Logout Card with Confirmation Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Card 
              className={`${interactiveCard} border-destructive/30 hover:border-destructive/50 cursor-pointer`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <LogOut size={24} className="text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className={cardTitle}>Logga ut</h3>
                  <p className={cardText}>Logga ut från ditt konto</p>
                </div>
              </div>
            </Card>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Vill du logga ut?</AlertDialogTitle>
              <AlertDialogDescription>
                Du kommer att loggas ut från ditt konto och behöver logga in igen för att använda appen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Avbryt</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">
                Logga ut
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Settings;
