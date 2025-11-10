import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MacroCalculatorProps {
  weight: string;
  onWeightChange: (value: string) => void;
  tdeeResult?: { loss: number; maintenance: number; gain: number } | null;
}

const MacroCalculator = ({ weight, onWeightChange, tdeeResult }: MacroCalculatorProps) => {
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<{
    calories: number;
    protein: { g: number; kcal: number; percent: number };
    fat: { g: number; kcal: number; percent: number };
    carbs: { g: number; kcal: number; percent: number };
  } | null>(null);

  const calculateMacros = async () => {
    const weightKg = parseFloat(weight);
    if (!weightKg || !goal || !tdeeResult) return;

    // Get calories based on goal
    let totalCalories: number;
    if (goal === "loss") {
      totalCalories = tdeeResult.loss;
    } else if (goal === "gain") {
      totalCalories = tdeeResult.gain;
    } else {
      totalCalories = tdeeResult.maintenance;
    }

    if (!totalCalories) return;

    // Define protein per kg based on goal
    let proteinPerKg: number;
    if (goal === "loss") {
      proteinPerKg = 2.0;
    } else if (goal === "gain") {
      proteinPerKg = 1.8;
    } else {
      proteinPerKg = 1.6;
    }

    const proteinG = weightKg * proteinPerKg;
    const proteinKcal = proteinG * 4;

    // Fat: 25% of total calories
    const fatKcal = totalCalories * 0.25;
    const fatG = fatKcal / 9;

    // Carbs: remaining calories
    const carbsKcal = totalCalories - (proteinKcal + fatKcal);
    const carbsG = carbsKcal / 4;

    const calculatedResult = {
      calories: totalCalories,
      protein: {
        g: Math.round(proteinG),
        kcal: Math.round(proteinKcal),
        percent: Math.round((proteinKcal / totalCalories) * 100),
      },
      fat: {
        g: Math.round(fatG),
        kcal: Math.round(fatKcal),
        percent: 25,
      },
      carbs: {
        g: Math.round(carbsG),
        kcal: Math.round(carbsKcal),
        percent: Math.round((carbsKcal / totalCalories) * 100),
      },
    };

    setResult(calculatedResult);

    // Save to database
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("calculation_history").insert({
        user_id: user.id,
        calculation_type: "macro",
        input_data: { weight: weightKg, goal },
        result_data: calculatedResult,
      });

      if (error) {
        console.error("Error saving Macro calculation:", error);
      }
    }
  };

  useEffect(() => {
    const weightKg = parseFloat(weight);

    if (weightKg > 0 && goal && tdeeResult) {
      calculateMacros();
    } else {
      setResult(null);
    }
  }, [weight, goal, tdeeResult]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle>Calculadora de Macros</CardTitle>
        </div>
        <CardDescription>Distribua suas macros por objetivo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!tdeeResult && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              Complete a Calculadora TMB/TDEE para obter as calorias automaticamente
            </p>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="macro-weight">Peso Corporal (kg)</Label>
          <Input
            id="macro-weight"
            type="number"
            min="0"
            placeholder="70"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Objetivo</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="loss">Perda de Peso</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
              <SelectItem value="gain">Ganho de Massa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {result && (
          <div className="mt-4 space-y-2">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 mb-3">
              <div className="text-sm font-medium text-foreground">Calorias do TDEE</div>
              <div className="text-2xl font-bold text-primary">{result.calories} kcal</div>
            </div>
            <div className="p-3 rounded-lg bg-info/10 border border-info/20">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Proteína</span>
                <span className="text-xs text-muted-foreground">{result.protein.percent}%</span>
              </div>
              <div className="text-lg font-bold text-info">
                {result.protein.g}g ({result.protein.kcal} kcal)
              </div>
            </div>
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Gorduras</span>
                <span className="text-xs text-muted-foreground">{result.fat.percent}%</span>
              </div>
              <div className="text-lg font-bold text-warning">
                {result.fat.g}g ({result.fat.kcal} kcal)
              </div>
            </div>
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Carboidratos</span>
                <span className="text-xs text-muted-foreground">{result.carbs.percent}%</span>
              </div>
              <div className="text-lg font-bold text-success">
                {result.carbs.g}g ({result.carbs.kcal} kcal)
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MacroCalculator;
