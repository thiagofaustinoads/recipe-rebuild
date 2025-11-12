import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Food {
  id: string;
  nome: string;
  energia_kcal: number;
  proteina_g: number;
  carboidrato_g: number;
  gordura_g: number;
}

interface FoodTableProps {
  foods: Food[];
  isLoading: boolean;
  onUpdate: () => void;
  isAdmin: boolean;
  onEdit: (food: Food) => void;
}

const FoodTable = ({ foods, isLoading, onUpdate, isAdmin, onEdit }: FoodTableProps) => {
  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este alimento?")) return;

    const { error } = await supabase.from("alimentos").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir alimento");
      return;
    }

    toast.success("Alimento excluído com sucesso");
    onUpdate();
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando...</div>;
  }

  if (foods.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Nenhum alimento encontrado</div>;
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Calorias (kcal)</TableHead>
            <TableHead className="text-right">Carboidratos (g)</TableHead>
            <TableHead className="text-right">Proteínas (g)</TableHead>
            <TableHead className="text-right">Gorduras (g)</TableHead>
            {isAdmin && <TableHead className="text-right">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {foods.map((food) => (
            <TableRow key={food.id}>
              <TableCell className="font-medium">{food.nome}</TableCell>
              <TableCell className="text-right font-semibold">{food.energia_kcal.toFixed(1)}</TableCell>
              <TableCell className="text-right">{food.carboidrato_g.toFixed(1)}</TableCell>
              <TableCell className="text-right">{food.proteina_g.toFixed(1)}</TableCell>
              <TableCell className="text-right">{food.gordura_g.toFixed(1)}</TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => onEdit(food)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(food.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FoodTable;
