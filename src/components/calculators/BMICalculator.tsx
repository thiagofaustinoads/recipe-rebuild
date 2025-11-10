import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BMICalculatorProps {
  weight: string;
  height: string;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
}

const BMICalculator = ({ weight, height, onWeightChange, onHeightChange }: BMICalculatorProps) => {
  const [result, setResult] = useState<{
    bmi: number;
    classification: string;
    color: string;
  } | null>(null);

  const calculateBMI = async () => {
    const weightKg = parseFloat(weight);
    const heightM = parseFloat(height) / 100;

    if (!weightKg || !heightM || heightM <= 0) return;

    const bmi = weightKg / (heightM * heightM);
    let classification = "";
    let color = "";

    if (bmi < 18.5) {
      classification = "Magreza";
      color = "text-info";
    } else if (bmi < 25) {
      classification = "Normal";
      color = "text-success";
    } else if (bmi < 30) {
      classification = "Sobrepeso";
      color = "text-warning";
    } else {
      classification = "Obesidade";
      color = "text-destructive";
    }

    const calculatedResult = { bmi: parseFloat(bmi.toFixed(1)), classification, color };
    setResult(calculatedResult);

    // Save to database
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("calculation_history").insert({
        user_id: user.id,
        calculation_type: "bmi",
        input_data: { weight: weightKg, height: parseFloat(height) },
        result_data: calculatedResult,
      });

      if (error) {
        console.error("Error saving BMI calculation:", error);
      }
    }
  };

  useEffect(() => {
    const weightKg = parseFloat(weight);
    const heightM = parseFloat(height) / 100;

    if (weightKg > 0 && heightM > 0) {
      calculateBMI();
    } else {
      setResult(null);
    }
  }, [weight, height]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle>Calculadora IMC</CardTitle>
        </div>
        <CardDescription>Calcule seu Índice de Massa Corporal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            min="0"
            placeholder="70"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Altura (cm)</Label>
          <Input
            id="height"
            type="number"
            min="0"
            placeholder="175"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
          />
        </div>

        {result && (
          <div className="mt-4 p-4 rounded-lg bg-secondary border border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{result.bmi}</div>
              <div className={`text-lg font-medium mt-1 ${result.color}`}>
                {result.classification}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BMICalculator;
