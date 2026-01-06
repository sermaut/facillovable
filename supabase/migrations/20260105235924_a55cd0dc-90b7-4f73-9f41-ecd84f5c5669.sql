-- Criar enum para status das solicitações
CREATE TYPE public.request_status AS ENUM ('pending', 'paid', 'delivered', 'cancelled');

-- Criar tabela de solicitações de créditos
CREATE TABLE public.credit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  invite_link TEXT NOT NULL,
  credits_amount INTEGER NOT NULL CHECK (credits_amount IN (10, 20, 50)),
  payment_proof_url TEXT,
  is_free_request BOOLEAN NOT NULL DEFAULT false,
  status request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para rastrear links usados (para validar 1 solicitação gratuita por link)
CREATE TABLE public.used_invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_link TEXT NOT NULL UNIQUE,
  request_id UUID REFERENCES public.credit_requests(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de roles para admin
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.credit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.used_invite_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Políticas RLS para credit_requests
-- Qualquer pessoa pode inserir (criar solicitação)
CREATE POLICY "Anyone can create credit requests"
ON public.credit_requests
FOR INSERT
WITH CHECK (true);

-- Qualquer pessoa pode ver suas próprias solicitações por whatsapp (para confirmação)
CREATE POLICY "Anyone can view by whatsapp"
ON public.credit_requests
FOR SELECT
USING (true);

-- Admins podem atualizar solicitações
CREATE POLICY "Admins can update credit requests"
ON public.credit_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas para used_invite_links
CREATE POLICY "Anyone can check used links"
ON public.used_invite_links
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert used links"
ON public.used_invite_links
FOR INSERT
WITH CHECK (true);

-- Políticas para user_roles
CREATE POLICY "Admins can view roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_credit_requests_updated_at
BEFORE UPDATE ON public.credit_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Criar bucket de storage para comprovantes
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', true);

-- Políticas de storage
CREATE POLICY "Anyone can upload payment proofs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Anyone can view payment proofs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-proofs');