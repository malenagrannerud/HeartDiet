import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { tips } from "@/data/tips";
import TipCard from "@/components/TipCard";
import { pageTitle, pageSubtitle, pageContainer, headerContainer, pagePadding, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { markedTipsSchema } from "@/lib/schemas";
import { BookmarkToggle } from "@/components/BookmarkToggle";
import { useToast } from "@/hooks/use-toast";

/**
 * Tips Page
 * 
 * toggleMark() - Marks/unmarks tips when user clicks checkbox
 * isMarked() - Checks if specific tip is marked
 * markedTips[] - Stores which tips user has marked
 * tips[] - Contains all available tip data
 * getStorageItem() - Loads marked tips from storage
 * setStorageItem() - Saves marked tips to storage
 * navigate() - Opens individual tip pages
 */

interface MarkedTip {
  id: number;
  markedDate: string;
  color: string;
}

const Tips = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [markedTips, setMarkedTips] = useState<MarkedTip[]>(() => {
    const result = getStorageItem("markedTips", markedTipsSchema);
    return (result as MarkedTip[]) ?? [];
  });

  // Map tip IDs to their individual page routes
  const tipPageRoutes: Record<number, string> = {
    1: '/app/TipPages/fruit',
    2: '/app/TipPages/fullkorn',
    3: '/app/TipPages/fish',
    4: '/app/TipPages/fett',
    5: '/app/TipPages/mejerier',
    6: '/app/TipPages/kott',
    7: '/app/TipPages/salt',
    8: '/app/TipPages/lagom',
    9: '/app/TipPages/motion',
    10: '/app/TipPages/baljvaxter',
    11: '/app/TipPages/socker',
  };

  useEffect(() => {
    setStorageItem("markedTips", markedTips, markedTipsSchema);
  }, [markedTips]);

  const toggleMark = (tipId: number) => {
    setMarkedTips((prev) => {
      const isMarked = prev.some((tip) => tip.id === tipId);
      const tip = tips.find((t) => t.id === tipId);
      
      if (isMarked) {
        toast({
          title: "Tips borttaget",
          description: `${tip?.title || "Tips"} har tagits bort från dina val`,
        });
        return prev.filter((tip) => tip.id !== tipId);
      } else {
        toast({
          title: "Tips tillagt",
          description: `${tip?.title || "Tips"} har lagts till i dina val`,
        });
        return [
          ...prev,
          {
            id: tipId,
            markedDate: new Date().toISOString(),
            color: tip?.color || "bg-green-200",
          },
        ];
      }
    });
  };

  const isMarked = (tipId: number) => markedTips.some((tip) => tip.id === tipId);

  const handleTipClick = (tipId: number) => {
    const route = tipPageRoutes[tipId];
    if (route) {
      navigate(route);
    } else {
      console.warn(`No route found for tip ID: ${tipId}`);
      // Optional: navigate to a fallback page or show error
      navigate('/app/tips');
    }
  };

  // Sort tips: marked tips first, then unmarked tips
  const sortedTips = useMemo(() => {
    const marked = tips.filter(tip => isMarked(tip.id));
    const unmarked = tips.filter(tip => !isMarked(tip.id));
    return [...marked, ...unmarked];
  }, [markedTips]);

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
        <h1 className={pageTitle}>Mina tips</h1>
        <p className={pageSubtitle}>Välj vilka tips du vill fokusera på genom att markera boxen</p>
      </header>

      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          <div className={standardSpacing.cardList}>
            {sortedTips.map((tip) => (
              <div key={tip.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <TipCard
                    tip={tip}
                    onClick={() => handleTipClick(tip.id)}
                  />
                </div>
                <BookmarkToggle
                  isSelected={isMarked(tip.id)}
                  onClick={() => toggleMark(tip.id)}
                  className="shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tips;
