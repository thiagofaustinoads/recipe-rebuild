import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Food {
  energia_kcal: number;
  proteina_g: number;
  carboidrato_g: number;
  gordura_g: number;
}

interface FoodChartProps {
  foods: Food[];
}

const FoodChart = ({ foods }: FoodChartProps) => {
  const totals = foods.reduce(
    (acc, food) => ({
      calorias: acc.calorias + food.energia_kcal,
      carboidratos: acc.carboidratos + food.carboidrato_g,
      proteinas: acc.proteinas + food.proteina_g,
      gorduras: acc.gorduras + food.gordura_g,
    }),
    { calorias: 0, carboidratos: 0, proteinas: 0, gorduras: 0 }
  );

  const chartData = [
    { name: "Calorias", valor: Math.round(totals.calorias), cor: "#8b5cf6" },
    { name: "Carboidratos (g)", valor: Math.round(totals.carboidratos), cor: "#3b82f6" },
    { name: "Proteínas (g)", valor: Math.round(totals.proteinas), cor: "#10b981" },
    { name: "Gorduras (g)", valor: Math.round(totals.gorduras), cor: "#f59e0b" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Totais Nutricionais</CardTitle>
        <CardDescription>Soma de todos os macronutrientes</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
            />
            <Legend />
            <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-lg font-bold">{item.valor.toLocaleString('pt-BR')}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodChart;
