import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserPlan } from '@/data/tips'; // Same import path
import { tips } from '@/data/tips'; // Same file
import { sectionHeading, sectionHeading2, cardText, backButton, pageContainer, pagePadding, bodyText, bodyTextBald } from "@/lib/design-tokens";
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
  const [isEditing, setIsEditing] = useState(false);

  // Load user plan from localStorage on component mount
  useEffect(() => {
    if (tip) {
      const savedPlan = localStorage.getItem(`userPlan-${tip.id}`);
      if (savedPlan) {
        setUserPlan(JSON.parse(savedPlan));
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
    setIsEditing(false);
    if (tip) {
      localStorage.removeItem(`userPlan-${tip.id}`);
    }
  };

  if (!tip) {
    return <div>Tip not found</div>;
  }

  return (
    <div className={pageContainer}>
      <div className={`w-full h-[200px] ${tip.color}`}></div>

      <div className={pagePadding}>
        <BackToTodayButton />
        <h2 className={sectionHeading}>{tip.title}</h2>
        <p className={`text-foreground leading-relaxed text-lg`}>{tip.detailedInfo}</p>

        {/* Steps section */}
        <div className="space-y-6 pt-6">
          {tip.steps.map(renderStep)}
        </div>

        {/* User Plan Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          {!userPlan && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              + Skapa min plan för detta tips
            </button>
          )}

          {isEditing && (
            <UserPlanForm
              tipId={tip.id}
              initialPlan={userPlan || undefined}
              onSave={handleSavePlan}
              onCancel={() => setIsEditing(false)}
            />
          )}

          {userPlan && !isEditing && (
            <UserPlanDisplay
              plan={userPlan}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDeletePlan}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TipDetail;