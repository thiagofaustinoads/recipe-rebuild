import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const foodSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(200),
  energia_kcal: z.number().min(0, "Calorias não podem ser negativas").max(9000),
  proteina_g: z.number().min(0, "Proteína não pode ser negativa").max(1000),
  carboidrato_g: z.number().min(0, "Carboidrato não pode ser negativo").max(1000),
  gordura_g: z.number().min(0, "Gordura não pode ser negativa").max(1000),
});

interface Food {
  id: string;
  nome: string;
  energia_kcal: number;
  proteina_g: number;
  carboidrato_g: number;
  gordura_g: number;
}

interface EditFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  food: Food | null;
}

const EditFoodDialog = ({ open, onOpenChange, onSuccess, food }: EditFoodDialogProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    energia_kcal: "",
    proteina_g: "",
    carboidrato_g: "",
    gordura_g: "",
  });

  useEffect(() => {
    if (food) {
      setFormData({
        nome: food.nome,
        energia_kcal: food.energia_kcal.toString(),
        proteina_g: food.proteina_g.toString(),
        carboidrato_g: food.carboidrato_g.toString(),
        gordura_g: food.gordura_g.toString(),
      });
    }
  }, [food]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!food) return;

    try {
      const validatedData = foodSchema.parse({
        nome: formData.nome,
        energia_kcal: parseFloat(formData.energia_kcal),
        proteina_g: parseFloat(formData.proteina_g),
        carboidrato_g: parseFloat(formData.carboidrato_g),
        gordura_g: parseFloat(formData.gordura_g),
      });

      const { error } = await supabase
        .from("alimentos")
        .update({
          nome: validatedData.nome,
          energia_kcal: validatedData.energia_kcal,
          proteina_g: validatedData.proteina_g,
          carboidrato_g: validatedData.carboidrato_g,
          gordura_g: validatedData.gordura_g,
        })
        .eq("id", food.id);

      if (error) {
        toast.error("Erro ao atualizar alimento");
        return;
      }

      toast.success("Alimento atualizado com sucesso");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
      toast.error("Erro ao validar dados");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Alimento</DialogTitle>
          <DialogDescription>Atualize as informações do alimento</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Alimento *</Label>
            <Input
              id="nome"
              required
              maxLength={200}
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="energia_kcal">Calorias (kcal) *</Label>
            <Input
              id="energia_kcal"
              type="number"
              step="0.1"
              min="0"
              required
              value={formData.energia_kcal}
              onChange={(e) => setFormData({ ...formData, energia_kcal: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carboidrato_g">Carboidratos (g) *</Label>
            <Input
              id="carboidrato_g"
              type="number"
              step="0.1"
              min="0"
              required
              value={formData.carboidrato_g}
              onChange={(e) => setFormData({ ...formData, carboidrato_g: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proteina_g">Proteínas (g) *</Label>
            <Input
              id="proteina_g"
              type="number"
              step="0.1"
              min="0"
              required
              value={formData.proteina_g}
              onChange={(e) => setFormData({ ...formData, proteina_g: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gordura_g">Gorduras (g) *</Label>
            <Input
              id="gordura_g"
              type="number"
              step="0.1"
              min="0"
              required
              value={formData.gordura_g}
              onChange={(e) => setFormData({ ...formData, gordura_g: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFoodDialog;
