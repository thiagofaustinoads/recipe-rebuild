import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trash2, Activity, Flame, Target } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CalculationHistory = () => {
  const queryClient = useQueryClient();

  const { data: history, isLoading } = useQuery({
    queryKey: ["calculation-history"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("calculation_history")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("calculation_history")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calculation-history"] });
      toast.success("Cálculo excluído com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir cálculo");
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "bmi":
        return <Activity className="h-4 w-4" />;
      case "tmb":
        return <Flame className="h-4 w-4" />;
      case "macro":
        return <Target className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bmi":
        return "IMC";
      case "tmb":
        return "TMB/TDEE";
      case "macro":
        return "Macros";
      default:
        return type;
    }
  };

  const formatResult = (type: string, result: any) => {
    switch (type) {
      case "bmi":
        return (
          <div className="space-y-1">
            <div className="text-sm">
              <span className="font-semibold">{result.bmi}</span> - {result.classification}
            </div>
          </div>
        );
      case "tmb":
        return (
          <div className="space-y-1">
            <div className="text-sm">TMB: <span className="font-semibold">{result.tmb} kcal</span></div>
            <div className="text-sm">TDEE: <span className="font-semibold">{result.tdee} kcal</span></div>
          </div>
        );
      case "macro":
        return (
          <div className="space-y-1">
            <div className="text-sm">Calorias: <span className="font-semibold">{result.calories} kcal</span></div>
            <div className="text-xs text-muted-foreground">
              P: {result.protein.g}g | C: {result.carbs.g}g | G: {result.fat.g}g
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Cálculos</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle>Histórico de Cálculos</CardTitle>
        </div>
        <CardDescription>
          Seus cálculos salvos automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!history || history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum cálculo realizado ainda
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getIcon(item.calculation_type)}
                    <span className="font-medium text-sm">
                      {getTypeLabel(item.calculation_type)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.created_at), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  {formatResult(item.calculation_type, item.result_data)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(item.id)}
                  disabled={deleteMutation.isPending}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalculationHistory;