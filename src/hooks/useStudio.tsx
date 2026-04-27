import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

/** Returns the active studio for the signed-in director (first one). */
export function useStudio() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-studio", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: dir } = await supabase
        .from("directors")
        .select("id, display_name, bio, web3_wallet")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (!dir) return null;
      const { data: studio } = await supabase
        .from("studios")
        .select("*")
        .eq("director_id", dir.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      return studio ? { ...studio, director: dir } : null;
    },
  });
}
