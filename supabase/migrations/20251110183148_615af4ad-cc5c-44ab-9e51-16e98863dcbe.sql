-- Create calculation history table
CREATE TABLE public.calculation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  calculation_type text NOT NULL CHECK (calculation_type IN ('bmi', 'tmb', 'macro')),
  input_data jsonb NOT NULL,
  result_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.calculation_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own calculation history
CREATE POLICY "Users can view their own calculations"
ON public.calculation_history
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own calculations
CREATE POLICY "Users can insert their own calculations"
ON public.calculation_history
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own calculations
CREATE POLICY "Users can delete their own calculations"
ON public.calculation_history
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_calculation_history_user_created 
ON public.calculation_history(user_id, created_at DESC);