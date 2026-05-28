import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-bold">Välkommen</h1>
        <p className="text-muted-foreground">
          Supabase är inte konfigurerat. Klicka nedan för att gå direkt till appen.
        </p>
        <Button onClick={() => navigate("/app")} className="w-full">
          Gå till appen
        </Button>
      </div>
    </div>
  );
};

export default Auth;
