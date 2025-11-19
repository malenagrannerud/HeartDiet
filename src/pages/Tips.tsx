
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tips } from "@/data/tips";
import TipCard from "@/components/TipCard";
import { pageTitle, pageSubtitle, pageContainer, headerContainer, pagePadding, standardSpacing } from "@/lib/design-tokens";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { markedTipsSchema } from "@/lib/schemas";

/**
 * Tips Page
 * 
 * toggleMark() - Marks/unmarks tips when user clicks icon
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
  const [markedTips, setMarkedTips] = useState<MarkedTip[]>(() => {
    const result = getStorageItem("markedTips", markedTipsSchema);
    return (result as MarkedTip[]) ?? [];
  });

  // Map tip IDs to their individual page routes
  const tipPageRoutes: Record<number, string> = {
    1: '/app/TipPages/fruit',
    2: '/app/TipPages/fullkorn',
    3: '/app/TipPages/fish',
    // Add more mappings as you create pages in pages/TipPages/
  };

  useEffect(() => {
    setStorageItem("markedTips", markedTips, markedTipsSchema);
  }, [markedTips]);

  const toggleMark = (e: React.MouseEvent, tipId: number) => {
    e.stopPropagation();
    setMarkedTips((prev) => {
      const isMarked = prev.some((tip) => tip.id === tipId);
      if (isMarked) {
        return prev.filter((tip) => tip.id !== tipId);
      } else {
        const tip = tips.find((t) => t.id === tipId);
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

  return (
    <div className={pageContainer}>
      <header className={headerContainer}>
        <h1 className={pageTitle}>Mina tips</h1>
        <p className={pageSubtitle}>Välj tips</p>
      </header>

      <main className={pagePadding}>
        <div className={standardSpacing.pageContent}>
          <div className={standardSpacing.cardList}>
            {tips.map((tip) => (
              <TipCard
                key={tip.id}
                tip={tip}
                isMarked={isMarked(tip.id)}
                onToggleMark={(e) => toggleMark(e, tip.id)}
                onClick={() => handleTipClick(tip.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tips;
