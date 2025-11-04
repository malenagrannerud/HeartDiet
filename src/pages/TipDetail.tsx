import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { tips } from "@/data/tips";
import { UserPlan } from "@/data/tips";
import { sectionHeading, sectionHeading2, cardText, backButton, pageContainer, headerContainer, pagePadding, bodyText, bodyTextBald } from "@/lib/design-tokens";
import { BackToTodayButton } from "@/components/BackToTodayButton";
import { UserPlanForm } from "@/components/UserPlanForm";
import { UserPlanDisplay } from "@/components/UserPlanDisplay";

// Helper function to render steps consistently
const renderStep = (step: any, index: number) => {
  // If step is an object with heading and content
  if (typeof step === 'object' && step.heading && step.content) {
    return (
      <div key={index} className="space-y-3">
        <h3 className={sectionHeading2}>
          {step.heading}
        </h3>
        <p className={bodyText}>{step.content}</p>
      </div>
    );
  }
  
  // If step is a simple string
  if (typeof step === 'string') {
    return (
      <div key={index} className="space-y-3">
        <h3 className={sectionHeading2}>
          Steg {index + 1}
        </h3>
        <p className={bodyText}>{step}</p>
      </div>
    );
  }
  
  // Fallback for any other format
  return (
    <div key={index} className="space-y-3">
      <h3 className={sectionHeading2}>
        Steg {index + 1}
      </h3>
      <p className={bodyText}>{String(step)}</p>
    </div>
  );
};

const TipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tip = tips.find((t) => t.id === Number(id));
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [isEditing, setIsEditing] = useState(!userPlan); // Start editing if no plan exists

  // Load user plan from localStorage on component mount
  useEffect(() => {
    if (tip) {
      const savedPlan = localStorage.getItem(`userPlan-${tip.id}`);
      if (savedPlan) {
        setUserPlan(JSON.parse(savedPlan));
        setIsEditing(false); // Don't show form if plan exists
      } else {
        setIsEditing(true); // Show form if no plan exists
      }
    }
  }, [tip]);

  const handleSavePlan = (plan: UserPlan) => {
    setUserPlan(plan);
    setIsEditing(false);
    if (tip) {
      localStorage.setItem(`userPlan-${tip.id}`, JSON.stringify(plan));
    }
  };

  const handleDeletePlan = () => {
    setUserPlan(null);
    setIsEditing(true); // Show form again after deletion
    if (tip) {
      localStorage.removeItem(`userPlan-${tip.id}`);
    }
  };

  if (!tip) {
    return <div>Tip not found</div>;
  }

  return (
    <div className={pageContainer}>
      <header className={`${headerContainer} ${tip.color}`}>
        <BackToTodayButton/>
      </header>
      <main className={pagePadding}>
        
        <h2 className={sectionHeading}>{tip.title}</h2>
        <p className={bodyText}>
          {tip.detailedInfo}
        </p>

        {/* Steps section */}
        <div className="space-y-6 pt-6">
          {tip.steps.map(renderStep)}
        </div>

        {/* User Plan Section - Always visible at the bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className={bodyTextBald}>Min plan</h3>
          
          {isEditing ? (
            <UserPlanForm
              tipId={tip.id}
              initialPlan={userPlan || undefined}
              onSave={handleSavePlan}
              onCancel={() => userPlan && setIsEditing(false)} // Only show cancel if plan exists
            />
          ) : (
            <UserPlanDisplay
              plan={userPlan!}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDeletePlan}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default TipDetail;