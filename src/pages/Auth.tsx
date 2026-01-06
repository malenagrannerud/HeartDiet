import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Input validation schemas
const emailSchema = z.string().trim().email("Ogiltig e-postadress");
const passwordSchema = z.string().min(6, "Lösenord måste vara minst 6 tecken");

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateInputs = (): boolean => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast({
        title: "Fel",
        description: emailResult.error.errors[0].message,
        variant: "destructive",
      });
      return false;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      toast({
        title: "Fel",
        description: passwordResult.error.errors[0].message,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        toast({
          title: "Välkommen tillbaka!",
          description: "Du är nu inloggad.",
        });
        navigate("/app");
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        toast({
          title: "Konto skapat!",
          description: "Kolla din e-post för att bekräfta ditt konto.",
        });
      }
    } catch (error: any) {
      let message = "Något gick fel. Försök igen.";
      
      if (error.message?.includes("Invalid login credentials")) {
        message = "Fel e-post eller lösenord.";
      } else if (error.message?.includes("User already registered")) {
        message = "Ett konto med denna e-post finns redan.";
      } else if (error.message?.includes("Email not confirmed")) {
        message = "Bekräfta din e-post först.";
      }

      toast({
        title: "Fel",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {isLogin ? "Logga in" : "Skapa konto"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLogin
              ? "Ange din e-post och lösenord"
              : "Fyll i dina uppgifter för att skapa ett konto"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input
              id="email"
              type="email"
              placeholder="din@epost.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Lösenord</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Laddar..."
              : isLogin
              ? "Logga in"
              : "Skapa konto"}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            {isLogin
              ? "Har du inget konto? Skapa ett här"
              : "Har du redan ett konto? Logga in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
