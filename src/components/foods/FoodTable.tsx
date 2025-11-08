import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Food {
  id: string;
  nome: string;
  categoria: string | null;
  descricao: string | null;
  peso_volume: string | null;
  preco_real: number | null;
  alergenos: string | null;
  armazenamento: string | null;
  porcao_amount: number;
  porcao_unit: string;
  energia_kcal: number;
  proteina_g: number;
  carboidrato_g: number;
  gordura_g: number;
  fibra_g: number | null;
  sodio_mg: number | null;
}

interface FoodTableProps {
  foods: Food[];
  isLoading: boolean;
  onUpdate: () => void;
  isAdmin: boolean;
}

const FoodTable = ({ foods, isLoading, onUpdate, isAdmin }: FoodTableProps) => {
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
            <TableHead>Categoria</TableHead>
            <TableHead>Porção</TableHead>
            <TableHead className="text-right">Kcal</TableHead>
            <TableHead className="text-right">Prot (g)</TableHead>
            <TableHead className="text-right">Carb (g)</TableHead>
            <TableHead className="text-right">Gord (g)</TableHead>
            <TableHead>Alergênicos</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            {isAdmin && <TableHead className="text-right">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {foods.map((food) => (
            <TableRow key={food.id}>
              <TableCell className="font-medium">{food.nome}</TableCell>
              <TableCell>
                {food.categoria && (
                  <Badge variant="secondary" className="text-xs">
                    {food.categoria}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {food.porcao_amount} {food.porcao_unit}
              </TableCell>
              <TableCell className="text-right font-semibold">{food.energia_kcal}</TableCell>
              <TableCell className="text-right">{food.proteina_g}</TableCell>
              <TableCell className="text-right">{food.carboidrato_g}</TableCell>
              <TableCell className="text-right">{food.gordura_g}</TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                {food.alergenos || "-"}
              </TableCell>
              <TableCell className="text-right">
                {food.preco_real ? `R$ ${food.preco_real.toFixed(2)}` : "-"}
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
