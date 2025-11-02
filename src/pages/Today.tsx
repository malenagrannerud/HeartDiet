import { useState, useEffect } from "react";
import { Clock, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { tips } from "@/data/tips";
import TipCard from "@/components/TipCard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { pageTitle, pageSubtitle, sectionHeading, sectionSubheading, cardTitle, cardText, cardTextSmall, standardCard, interactiveCard, pageContainer, pagePadding, iconButton, headerContainer, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { markedTipsSchema, completedActivitiesSchema } from "@/lib/schemas";

interface MarkedTip {
  id: number;
  markedDate: string;
  color: string;
}

interface CompletedActivity {
  id: string;
  title: string;
  completedDate: string;
  type: 'tutorial' | 'health-priorities' | 'health-metrics';
}

const Today = () => {
  const navigate = useNavigate();
  const [markedTips, setMarkedTips] = useState<MarkedTip[]>([]);
  const [completedActivities, setCompletedActivities] = useState<CompletedActivity[]>([]);
  const [recentActivities, setRecentActivities] = useState<CompletedActivity[]>([]);

  useEffect(() => {
    const savedTips = getStorageItem('markedTips', markedTipsSchema);
    if (savedTips) {
      setMarkedTips(savedTips as MarkedTip[]);
    }

    // Load completed activities
    const completed = getStorageItem('completedActivities', completedActivitiesSchema);
    if (completed) {
      setCompletedActivities(completed as CompletedActivity[]);
    }

    // Check for daily reset at midnight
    checkAndResetDaily();
  }, []);

  const checkAndResetDaily = () => {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('lastResetDate');
    
    if (lastReset !== today) {
      // It's a new day - move completed activities to recent
      const completed = getStorageItem('completedActivities', completedActivitiesSchema);
      if (completed) {
        const activities = completed as CompletedActivity[];
        const recent = getStorageItem('recentActivities', completedActivitiesSchema);
        const existingRecent: CompletedActivity[] = recent ? (recent as CompletedActivity[]) : [];
        
        // Combine and keep only last 30 days
        const allRecent = [...existingRecent, ...activities];
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const filteredRecent = allRecent.filter(activity => 
          new Date(activity.completedDate) > thirtyDaysAgo
        );
        
        setStorageItem('recentActivities', filteredRecent, completedActivitiesSchema);
        setRecentActivities(filteredRecent);
        
        // Clear today's completed activities
        setStorageItem('completedActivities', [], completedActivitiesSchema);
        setCompletedActivities([]);
      }
      
      localStorage.setItem('lastResetDate', today);
    } else {
      // Load recent activities
      const recent = getStorageItem('recentActivities', completedActivitiesSchema);
      if (recent) {
        setRecentActivities(recent as CompletedActivity[]);
      }
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min sedan`;
    if (diffHours < 24) return `${diffHours} timmar sedan`;
    if (diffDays === 1) return 'Igår';
    return `${diffDays} dagar sedan`;
  };

  const markedTipsList = tips.filter(tip => markedTips.some(mt => mt.id === tip.id));

  const allCompletedActivities = [...completedActivities, ...recentActivities].sort(
    (a, b) => new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime()
  );

  return (
    <div className={pageContainer}>
      {/* HEADER CONTAINER */}
      <header className={headerContainer}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className={pageTitle}>Idag</h1>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className={iconButton}
                aria-label="Visa senaste aktiviteter"
              >
                <History size={24} className="text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md bg-background">
              <SheetHeader>
                <SheetTitle className={sectionHeading}>Senast</SheetTitle>
              </SheetHeader>
              <div className={`mt-6 ${standardSpacing.cardList}`}>
                {allCompletedActivities.length > 0 ? (
                  allCompletedActivities.map((activity, index) => (
                    <Card 
                      key={`${activity.id}-${index}`}
                      className={standardCard}
                    >
                      <h4 className={`${cardTitle} mb-1`}>{activity.title}</h4>
                      <p className={cardTextSmall}>
                        {getRelativeTime(activity.completedDate)}
                      </p>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Inga genomförda aktiviteter än
                  </p>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* FIRST PAGE PADDING: Starta här and down */}
      <div className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          <div className={standardSpacing.sectionContent}>
            <h3 className={sectionHeading}>Starta här</h3>
            
            <div className={standardSpacing.cardList}>
              <Card 
                className={interactiveCard}
                onClick={() => navigate('/app/tutorial')}
                aria-label="Gå till tutorial"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={cardTitle}>Så fungerar appen</h4>
                    <div className={cardTextSmall}>
                      ◷ 5 min
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card 
                className={interactiveCard}
                onClick={() => navigate('/app/health-priorities')}
                aria-label="Gå till mina hälsoprioriteringar"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={cardTitle}>Anpassa tips efter mina mål</h4>
                    <div className={cardTextSmall}>
                      ◷ 5 min
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card 
                className={interactiveCard}
                onClick={() => navigate('/app/health-metrics')}
                aria-label="Gå till hälsomätningar"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={cardTitle}>Vikt och blodtryck</h4>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND PAGE PADDING: Mina tips den här veckan and down */}
      <div className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          <div className={standardSpacing.sectionContent}>
            <h3 className={sectionHeading}>Mina tips den här veckan</h3>
            {markedTipsList.length > 0 ? (
              <div className={standardSpacing.cardList}>
                {markedTipsList.map((tip) => (
                  <TipCard
                    key={tip.id}
                    tip={tip}
                    isMarked={true}
                    onToggleMark={(e) => e.stopPropagation()}
                    onClick={() => navigate(`/app/tips/${tip.id}`)}
                  />
                ))}
              </div>
            ) : (
              <p className={sectionSubheading}>Välj ett eller två tips för veckan under "Tips"</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Today;