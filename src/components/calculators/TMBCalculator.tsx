import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flame } from "lucide-react";

interface TMBCalculatorProps {
  weight: string;
  height: string;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
}

const TMBCalculator = ({ weight, height, onWeightChange, onHeightChange }: TMBCalculatorProps) => {
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState("");
  const [result, setResult] = useState<{
    tmb: number;
    tdee: number;
    loss: number;
    maintenance: number;
    gain: number;
  } | null>(null);

  const calculateTMB = () => {
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    const ageYears = parseFloat(age);

    if (!weightKg || !heightCm || !ageYears || !sex || !activity) return;

    // Mifflin-St Jeor Formula
    let tmb: number;
    if (sex === "male") {
      tmb = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
    } else {
      tmb = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
    }

    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = tmb * activityMultipliers[activity];

    setResult({
      tmb: Math.round(tmb),
      tdee: Math.round(tdee),
      loss: Math.round(tdee - 500),
      maintenance: Math.round(tdee),
      gain: Math.round(tdee + 500),
    });
  };

  useEffect(() => {
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    const ageYears = parseFloat(age);

    if (weightKg > 0 && heightCm > 0 && ageYears > 0 && sex && activity) {
      calculateTMB();
    } else {
      setResult(null);
    }
  }, [weight, height, age, sex, activity]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-accent" />
          <CardTitle>Calculadora TMB/TDEE</CardTitle>
        </div>
        <CardDescription>Taxa Metabólica Basal e Gasto Energético Diário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Sexo</Label>
            <Select value={sex} onValueChange={setSex}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tmb-age">Idade</Label>
            <Input
              id="tmb-age"
              type="number"
              min="0"
              placeholder="30"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tmb-weight">Peso (kg)</Label>
            <Input
              id="tmb-weight"
              type="number"
              min="0"
              placeholder="70"
              value={weight}
              onChange={(e) => onWeightChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tmb-height">Altura (cm)</Label>
            <Input
              id="tmb-height"
              type="number"
              min="0"
              placeholder="175"
              value={height}
              onChange={(e) => onHeightChange(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Nível de Atividade</Label>
          <Select value={activity} onValueChange={setActivity}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.2">Sedentário (pouco ou nenhum exercício)</SelectItem>
              <SelectItem value="1.375">Levemente ativo (1-3 dias/semana)</SelectItem>
              <SelectItem value="1.55">Moderadamente ativo (3-5 dias/semana)</SelectItem>
              <SelectItem value="1.725">Muito ativo (6-7 dias/semana)</SelectItem>
              <SelectItem value="1.9">Extremamente ativo (atleta)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {result && (
          <div className="mt-4 space-y-3">
            <div className="p-3 rounded-lg bg-secondary border border-border">
              <div className="text-sm text-muted-foreground">TMB (Basal)</div>
              <div className="text-xl font-bold text-foreground">{result.tmb} kcal</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary border border-border">
              <div className="text-sm text-muted-foreground">TDEE (Gasto Diário)</div>
              <div className="text-xl font-bold text-foreground">{result.tdee} kcal</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="p-2 rounded bg-destructive/10">
                <div className="text-xs text-muted-foreground">Perda</div>
                <div className="font-semibold text-destructive">{result.loss}</div>
              </div>
              <div className="p-2 rounded bg-success/10">
                <div className="text-xs text-muted-foreground">Manutenção</div>
                <div className="font-semibold text-success">{result.maintenance}</div>
              </div>
              <div className="p-2 rounded bg-info/10">
                <div className="text-xs text-muted-foreground">Ganho</div>
                <div className="font-semibold text-info">{result.gain}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TMBCalculator;
