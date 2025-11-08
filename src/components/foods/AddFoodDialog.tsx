import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

// Validation schema for food entries
const foodSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório").max(200, "Nome muito longo (máx. 200 caracteres)"),
  categoria: z.string().trim().max(100, "Categoria muito longa (máx. 100 caracteres)").optional().or(z.literal("")),
  descricao: z.string().trim().max(1000, "Descrição muito longa (máx. 1000 caracteres)").optional().or(z.literal("")),
  peso_volume: z.string().trim().max(50, "Peso/Volume muito longo (máx. 50 caracteres)").optional().or(z.literal("")),
  preco_real: z.number().min(0, "Preço não pode ser negativo").max(100000, "Preço muito alto").optional(),
  alergenos: z.string().trim().max(500, "Campo muito longo (máx. 500 caracteres)").optional().or(z.literal("")),
  armazenamento: z.string().trim().max(200, "Campo muito longo (máx. 200 caracteres)").optional().or(z.literal("")),
  porcao_amount: z.number().min(0.1, "Quantidade deve ser maior que 0").max(10000, "Quantidade muito alta"),
  porcao_unit: z.string().trim().min(1, "Unidade é obrigatória").max(20, "Unidade muito longa"),
  energia_kcal: z.number().min(0, "Energia não pode ser negativa").max(9000, "Energia muito alta (máx. 9000 kcal)"),
  proteina_g: z.number().min(0, "Proteína não pode ser negativa").max(1000, "Proteína muito alta (máx. 1000g)"),
  carboidrato_g: z.number().min(0, "Carboidrato não pode ser negativo").max(1000, "Carboidrato muito alto (máx. 1000g)"),
  gordura_g: z.number().min(0, "Gordura não pode ser negativa").max(1000, "Gordura muito alta (máx. 1000g)"),
  fibra_g: z.number().min(0, "Fibra não pode ser negativa").max(500, "Fibra muito alta (máx. 500g)").optional(),
  sodio_mg: z.number().min(0, "Sódio não pode ser negativo").max(50000, "Sódio muito alto (máx. 50000mg)").optional(),
});

interface AddFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddFoodDialog = ({ open, onOpenChange, onSuccess }: AddFoodDialogProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    descricao: "",
    peso_volume: "",
    preco_real: "",
    alergenos: "",
    armazenamento: "",
    porcao_amount: "",
    porcao_unit: "g",
    energia_kcal: "",
    proteina_g: "",
    carboidrato_g: "",
    gordura_g: "",
    fibra_g: "",
    sodio_mg: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Parse and validate form data
      const validatedData = foodSchema.parse({
        nome: formData.nome,
        categoria: formData.categoria || "",
        descricao: formData.descricao || "",
        peso_volume: formData.peso_volume || "",
        preco_real: formData.preco_real ? parseFloat(formData.preco_real) : undefined,
        alergenos: formData.alergenos || "",
        armazenamento: formData.armazenamento || "",
        porcao_amount: parseFloat(formData.porcao_amount),
        porcao_unit: formData.porcao_unit,
        energia_kcal: parseFloat(formData.energia_kcal),
        proteina_g: parseFloat(formData.proteina_g),
        carboidrato_g: parseFloat(formData.carboidrato_g),
        gordura_g: parseFloat(formData.gordura_g),
        fibra_g: formData.fibra_g ? parseFloat(formData.fibra_g) : undefined,
        sodio_mg: formData.sodio_mg ? parseFloat(formData.sodio_mg) : undefined,
      });

      // Insert validated data into database
      const { error } = await supabase.from("alimentos").insert({
        nome: validatedData.nome,
        categoria: validatedData.categoria || null,
        descricao: validatedData.descricao || null,
        peso_volume: validatedData.peso_volume || null,
        preco_real: validatedData.preco_real ?? null,
        alergenos: validatedData.alergenos || null,
        armazenamento: validatedData.armazenamento || null,
        porcao_amount: validatedData.porcao_amount,
        porcao_unit: validatedData.porcao_unit,
        energia_kcal: validatedData.energia_kcal,
        proteina_g: validatedData.proteina_g,
        carboidrato_g: validatedData.carboidrato_g,
        gordura_g: validatedData.gordura_g,
        fibra_g: validatedData.fibra_g ?? null,
        sodio_mg: validatedData.sodio_mg ?? null,
      });

      if (error) {
        toast.error("Erro ao adicionar alimento");
        return;
      }

      toast.success("Alimento adicionado com sucesso");
      onSuccess();
      onOpenChange(false);
      setFormData({
        nome: "",
        categoria: "",
        descricao: "",
        peso_volume: "",
        preco_real: "",
        alergenos: "",
        armazenamento: "",
        porcao_amount: "",
        porcao_unit: "g",
        energia_kcal: "",
        proteina_g: "",
        carboidrato_g: "",
        gordura_g: "",
        fibra_g: "",
        sodio_mg: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Show first validation error to user
        toast.error(error.errors[0].message);
        return;
      }
      toast.error("Erro ao validar dados");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Alimento</DialogTitle>
          <DialogDescription>Preencha as informações nutricionais do alimento</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
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
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                maxLength={100}
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peso_volume">Peso/Volume</Label>
              <Input
                id="peso_volume"
                placeholder="100 g"
                maxLength={50}
                value={formData.peso_volume}
                onChange={(e) => setFormData({ ...formData, peso_volume: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                maxLength={1000}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Informação Nutricional (por porção)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="porcao_amount">Quantidade da Porção *</Label>
                <Input
                  id="porcao_amount"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10000"
                  required
                  value={formData.porcao_amount}
                  onChange={(e) => setFormData({ ...formData, porcao_amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="porcao_unit">Unidade *</Label>
                <Input
                  id="porcao_unit"
                  required
                  maxLength={20}
                  value={formData.porcao_unit}
                  onChange={(e) => setFormData({ ...formData, porcao_unit: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="energia_kcal">Energia (kcal) *</Label>
                <Input
                  id="energia_kcal"
                  type="number"
                  step="0.1"
                  min="0"
                  max="9000"
                  required
                  value={formData.energia_kcal}
                  onChange={(e) => setFormData({ ...formData, energia_kcal: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proteina_g">Proteína (g) *</Label>
                <Input
                  id="proteina_g"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1000"
                  required
                  value={formData.proteina_g}
                  onChange={(e) => setFormData({ ...formData, proteina_g: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carboidrato_g">Carboidratos (g) *</Label>
                <Input
                  id="carboidrato_g"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1000"
                  required
                  value={formData.carboidrato_g}
                  onChange={(e) => setFormData({ ...formData, carboidrato_g: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gordura_g">Gorduras (g) *</Label>
                <Input
                  id="gordura_g"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1000"
                  required
                  value={formData.gordura_g}
                  onChange={(e) => setFormData({ ...formData, gordura_g: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fibra_g">Fibras (g)</Label>
                <Input
                  id="fibra_g"
                  type="number"
                  step="0.1"
                  min="0"
                  max="500"
                  value={formData.fibra_g}
                  onChange={(e) => setFormData({ ...formData, fibra_g: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sodio_mg">Sódio (mg)</Label>
                <Input
                  id="sodio_mg"
                  type="number"
                  step="0.1"
                  min="0"
                  max="50000"
                  value={formData.sodio_mg}
                  onChange={(e) => setFormData({ ...formData, sodio_mg: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Informações Adicionais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alergenos">Alergênicos</Label>
                <Input
                  id="alergenos"
                  placeholder="Não contém"
                  maxLength={500}
                  value={formData.alergenos}
                  onChange={(e) => setFormData({ ...formData, alergenos: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="armazenamento">Modo de Armazenamento</Label>
                <Input
                  id="armazenamento"
                  placeholder="Refrigerado"
                  maxLength={200}
                  value={formData.armazenamento}
                  onChange={(e) => setFormData({ ...formData, armazenamento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preco_real">Preço (R$)</Label>
                <Input
                  id="preco_real"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100000"
                  placeholder="0.00"
                  value={formData.preco_real}
                  onChange={(e) => setFormData({ ...formData, preco_real: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar Alimento</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodDialog;
