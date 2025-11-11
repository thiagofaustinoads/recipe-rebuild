-- Create calculation_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.calculation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  calculation_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  result_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.calculation_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own calculations" ON public.calculation_history;
DROP POLICY IF EXISTS "Users can insert their own calculations" ON public.calculation_history;
DROP POLICY IF EXISTS "Users can delete their own calculations" ON public.calculation_history;

-- Create policies
CREATE POLICY "Users can view their own calculations"
  ON public.calculation_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calculations"
  ON public.calculation_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calculations"
  ON public.calculation_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_calculation_history_user_created 
  ON public.calculation_history(user_id, created_at DESC);