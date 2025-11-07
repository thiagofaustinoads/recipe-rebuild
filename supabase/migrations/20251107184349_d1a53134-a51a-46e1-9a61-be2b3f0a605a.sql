-- Create alimentos (foods) table
CREATE TABLE public.alimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  categoria TEXT,
  descricao TEXT,
  peso_volume TEXT,
  preco_real NUMERIC(8,2),
  alergenos TEXT,
  armazenamento TEXT,
  -- Nutritional fields per portion
  porcao_amount NUMERIC NOT NULL,
  porcao_unit TEXT NOT NULL,
  energia_kcal NUMERIC NOT NULL,
  proteina_g NUMERIC NOT NULL,
  carboidrato_g NUMERIC NOT NULL,
  gordura_g NUMERIC NOT NULL,
  fibra_g NUMERIC,
  sodio_mg NUMERIC,
  outros JSONB,
  -- Normalized values per 100g/ml for conversions
  energia_por_100g NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN porcao_unit IN ('g', 'ml') AND porcao_amount > 0 
      THEN (energia_kcal / porcao_amount) * 100
      ELSE NULL
    END
  ) STORED,
  proteina_por_100g NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN porcao_unit IN ('g', 'ml') AND porcao_amount > 0 
      THEN (proteina_g / porcao_amount) * 100
      ELSE NULL
    END
  ) STORED,
  carboidrato_por_100g NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN porcao_unit IN ('g', 'ml') AND porcao_amount > 0 
      THEN (carboidrato_g / porcao_amount) * 100
      ELSE NULL
    END
  ) STORED,
  gordura_por_100g NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN porcao_unit IN ('g', 'ml') AND porcao_amount > 0 
      THEN (gordura_g / porcao_amount) * 100
      ELSE NULL
    END
  ) STORED,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.alimentos ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view foods)
CREATE POLICY "Anyone can view foods"
  ON public.alimentos
  FOR SELECT
  USING (true);

-- For now, allow anyone to insert/update/delete (can be restricted later to admin users)
CREATE POLICY "Anyone can insert foods"
  ON public.alimentos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update foods"
  ON public.alimentos
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete foods"
  ON public.alimentos
  FOR DELETE
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_alimentos_categoria ON public.alimentos(categoria);
CREATE INDEX idx_alimentos_nome ON public.alimentos(nome);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_alimentos_updated_at
  BEFORE UPDATE ON public.alimentos
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data (5 foods as specified)
INSERT INTO public.alimentos (nome, categoria, descricao, porcao_amount, porcao_unit, energia_kcal, proteina_g, carboidrato_g, gordura_g, fibra_g, sodio_mg, peso_volume, alergenos, armazenamento, preco_real) VALUES
('Aveia em flocos', 'Cereais', 'Aveia integral', 100, 'g', 389, 16.9, 66.3, 6.9, 10.6, 5, '100 g', 'Pode conter glúten', 'Local seco', 8.50),
('Peito de frango grelhado', 'Carnes', 'Sem pele', 100, 'g', 165, 31, 0, 3.6, 0, 74, '100 g', 'Não contém', 'Refrigerado', 12.00),
('Maçã Gala', 'Frutas', 'Maçã fresca', 150, 'g', 78, 0.45, 21, 0.3, 3.6, 2, '1 un (~150 g)', 'Não contém', 'Refrigerada', 3.50),
('Arroz integral cozido', 'Grãos', 'Arroz integral', 100, 'g', 111, 2.6, 23, 0.9, 1.8, 5, '100 g', 'Não contém', 'Local seco', 5.00),
('Azeite de oliva extra virgem', 'Óleos', 'Fonte de gorduras boas', 15, 'ml', 119, 0, 0, 13.5, 0, 0, '15 ml', 'Não contém', 'Ambiente seco', 0.90);