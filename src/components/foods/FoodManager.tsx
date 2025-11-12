import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import FoodTable from "./FoodTable";
import AddFoodDialog from "./AddFoodDialog";
import EditFoodDialog from "./EditFoodDialog";
import FoodChart from "./FoodChart";
import { toast } from "sonner";

interface Food {
  id: string;
  nome: string;
  energia_kcal: number;
  proteina_g: number;
  carboidrato_g: number;
  gordura_g: number;
}

const FoodManager = () => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const { data: foods, isLoading, refetch } = useQuery({
    queryKey: ["foods", searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("alimentos")
        .select("id, nome, energia_kcal, proteina_g, carboidrato_g, gordura_g")
        .order("nome");

      if (searchTerm) {
        query = query.ilike("nome", `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        toast.error("Erro ao carregar alimentos");
        throw error;
      }

      return data as Food[];
    },
  });

  const totalCalories = foods?.reduce((sum, food) => sum + food.energia_kcal, 0) || 0;

  const handleEdit = (food: Food) => {
    setSelectedFood(food);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Total de Calorias */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Calorias</p>
              <p className="text-4xl font-bold text-primary">{totalCalories.toFixed(0)} kcal</p>
            </div>
            {isAdmin && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Alimento
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Barra de Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar alimento por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Layout Grid: Tabela à esquerda, Gráfico à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Alimentos</CardTitle>
            <CardDescription>Todos os alimentos cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <FoodTable 
              foods={foods || []} 
              isLoading={isLoading} 
              onUpdate={refetch} 
              isAdmin={isAdmin}
              onEdit={handleEdit}
            />
          </CardContent>
        </Card>

        <FoodChart foods={foods || []} />
      </div>

      <AddFoodDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={refetch}
      />

      <EditFoodDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={refetch}
        food={selectedFood}
      />
    </div>
  );
};

export default FoodManager;
