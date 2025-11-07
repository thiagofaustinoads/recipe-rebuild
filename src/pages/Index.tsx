import { useState } from "react";
import { Calculator, Apple, UtensilsCrossed, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BMICalculator from "@/components/calculators/BMICalculator";
import TMBCalculator from "@/components/calculators/TMBCalculator";
import MacroCalculator from "@/components/calculators/MacroCalculator";
import FoodManager from "@/components/foods/FoodManager";

const Index = () => {
  // Shared state for weight and height across calculators
  const [sharedWeight, setSharedWeight] = useState("");
  const [sharedHeight, setSharedHeight] = useState("");

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Apple className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">NutriCalc Pro</h1>
              <p className="text-sm text-muted-foreground">Gestão Nutricional Completa</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calculators" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="calculators" className="gap-2">
              <Calculator className="h-4 w-4" />
              Calculadoras
            </TabsTrigger>
            <TabsTrigger value="foods" className="gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Alimentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculators" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <BMICalculator 
                weight={sharedWeight}
                height={sharedHeight}
                onWeightChange={setSharedWeight}
                onHeightChange={setSharedHeight}
              />
              <TMBCalculator 
                weight={sharedWeight}
                height={sharedHeight}
                onWeightChange={setSharedWeight}
                onHeightChange={setSharedHeight}
              />
              <MacroCalculator />
            </div>
          </TabsContent>

          <TabsContent value="foods">
            <FoodManager />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>NutriCalc Pro - Sistema de gestão nutricional</p>
          <p className="mt-2 text-xs">Os cálculos são estimativas. Consulte um nutricionista para orientação personalizada.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
