import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreditPackages } from "./CreditPackages";

interface RequestFormProps {
  onSuccess: (data: {
    fullName: string;
    whatsapp: string;
    inviteLink: string;
    creditsAmount: number;
    isFreeRequest: boolean;
  }) => void;
}

export const RequestForm = ({ onSuccess }: RequestFormProps) => {
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [creditsAmount, setCreditsAmount] = useState<number | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFreeRequest, setIsFreeRequest] = useState<boolean | null>(null);
  const [linkChecked, setLinkChecked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const checkInviteLink = async (link: string) => {
    if (!link.includes("lovable.dev") && !link.includes("lovable.app")) {
      setLinkChecked(false);
      return;
    }

    const { data } = await supabase
      .from("used_invite_links")
      .select("id")
      .eq("invite_link", link)
      .single();

    setIsFreeRequest(!data);
    setLinkChecked(true);
  };

  const handleInviteLinkChange = (value: string) => {
    setInviteLink(value);
    setLinkChecked(false);
    if (value.length > 20) {
      checkInviteLink(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Ficheiro muito grande",
          description: "O tamanho máximo é 10MB",
          variant: "destructive",
        });
        return;
      }
      setPaymentProof(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !whatsapp || !inviteLink || !creditsAmount) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    // Comprovante só é obrigatório se o link já foi usado (não é primeira solicitação)

    setIsLoading(true);

    try {
      let paymentProofUrl = null;

      if (paymentProof) {
        const fileExt = paymentProof.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .upload(fileName, paymentProof);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("payment-proofs")
          .getPublicUrl(fileName);
        
        paymentProofUrl = urlData.publicUrl;
      }

      const { data: requestData, error: requestError } = await supabase
        .from("credit_requests")
        .insert({
          full_name: fullName,
          whatsapp: whatsapp,
          invite_link: inviteLink,
          credits_amount: creditsAmount,
          payment_proof_url: paymentProofUrl,
          is_free_request: isFreeRequest || false,
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Mark link as used if free request
      if (isFreeRequest) {
        await supabase
          .from("used_invite_links")
          .insert({
            invite_link: inviteLink,
            request_id: requestData.id,
          });
      }

      onSuccess({
        fullName,
        whatsapp,
        inviteLink,
        creditsAmount,
        isFreeRequest: isFreeRequest || false,
      });

    } catch (error: any) {
      toast({
        title: "Erro ao enviar",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="request-form" className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Solicitar Créditos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Preencha o formulário abaixo para fazer sua solicitação
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground font-medium">
                  Nome Completo *
                </Label>
                <Input
                  id="fullName"
                  placeholder="Ex: João Silva"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-foreground font-medium">
                  WhatsApp *
                </Label>
                <Input
                  id="whatsapp"
                  placeholder="Ex: +244 923 456 789"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviteLink" className="text-foreground font-medium">
                Link de Convite Lovable *
              </Label>
              <div className="relative">
                <Input
                  id="inviteLink"
                  placeholder="Ex: https://lovable.dev/invite/..."
                  value={inviteLink}
                  onChange={(e) => handleInviteLinkChange(e.target.value)}
                  className="h-12 pr-10"
                  required
                />
                {linkChecked && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isFreeRequest ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-secondary" />
                    )}
                  </div>
                )}
              </div>
              {linkChecked && (
                <p className={`text-sm ${isFreeRequest ? "text-primary" : "text-secondary"}`}>
                  {isFreeRequest 
                    ? "✨ Este link ainda não foi usado! Primeira solicitação gratuita." 
                    : "Este link já foi usado. Pagamento necessário."}
                </p>
              )}
            </div>
          </div>

          <CreditPackages
            selectedAmount={creditsAmount}
            onSelect={setCreditsAmount}
            isFreeRequest={isFreeRequest || false}
          />

          {linkChecked && (
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border space-y-6">
              {!isFreeRequest && (
                <div className="p-4 rounded-xl bg-accent border border-primary/20">
                  <h3 className="font-display font-semibold text-foreground mb-3">
                    Dados para Pagamento
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Multicaixa Express:</strong> 927 800 658</p>
                    <p><strong>Titular:</strong> Manuel Bessa Mendes</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-foreground font-medium">
                  Comprovante de Pagamento {!isFreeRequest ? "(recomendado)" : "(opcional)"}
                </Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {paymentProof ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">{paymentProof.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Clique para anexar ou arraste o ficheiro
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG ou PDF (máx. 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              type="submit"
              variant="hero"
              size="xl"
              disabled={isLoading || !creditsAmount}
              className="min-w-[250px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Solicitação"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
