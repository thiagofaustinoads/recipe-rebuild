import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, History } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalculationRecord {
  id: string;
  calculation_type: string;
  input_data: any;
  result_data: any;
  created_at: string;
}

const CalculationHistory = () => {
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('calculation_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('calculation_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Registro excluído",
        description: "O cálculo foi removido do histórico.",
      });

      loadHistory();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível remover o registro.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadHistory();

    const channel = supabase
      .channel('calculation_history_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'calculation_history' },
        () => loadHistory()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getCalculationType = (type: string) => {
    const types: Record<string, string> = {
      bmi: "IMC",
      tmb: "TMB/TDEE",
      macro: "Macros"
    };
    return types[type] || type;
  };

  const formatResult = (type: string, result: any) => {
    if (type === 'bmi') {
      return `IMC: ${result.bmi} - ${result.classification}`;
    }
    if (type === 'tmb') {
      return `TMB: ${result.tmb} kcal | TDEE: ${result.tdee} kcal`;
    }
    if (type === 'macro') {
      return `${result.calories} kcal | P: ${result.protein.g}g | C: ${result.carbs.g}g | G: ${result.fat.g}g`;
    }
    return '';
  };

  if (loading) {
    return <div className="text-center text-muted-foreground">Carregando histórico...</div>;
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle>Histórico de Cálculos</CardTitle>
          </div>
          <CardDescription>Seus cálculos aparecerão aqui</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum cálculo realizado ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <CardTitle>Histórico de Cálculos</CardTitle>
        </div>
        <CardDescription>
          {history.length} {history.length === 1 ? 'cálculo realizado' : 'cálculos realizados'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((record) => (
            <div
              key={record.id}
              className="flex items-start justify-between p-4 rounded-lg border border-border bg-secondary/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">
                    {getCalculationType(record.calculation_type)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(record.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm text-foreground">
                  {formatResult(record.calculation_type, record.result_data)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteRecord(record.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationHistory;
