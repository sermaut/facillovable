import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle, Home } from "lucide-react";

interface SuccessMessageProps {
  data: {
    fullName: string;
    whatsapp: string;
    inviteLink: string;
    creditsAmount: number;
    isFreeRequest: boolean;
  };
  onBackHome: () => void;
}

export const SuccessMessage = ({ data, onBackHome }: SuccessMessageProps) => {
  const adminWhatsApp = "244927800658";
  
  const whatsappMessage = encodeURIComponent(
    `🎯 *Nova Solicitação Facillovable*\n\n` +
    `👤 *Nome:* ${data.fullName}\n` +
    `📱 *WhatsApp:* ${data.whatsapp}\n` +
    `🔗 *Link:* ${data.inviteLink}\n` +
    `💳 *Créditos:* ${data.creditsAmount}\n` +
    `📋 *Tipo:* ${data.isFreeRequest ? "Solicitação Gratuita (1ª vez)" : "Pagamento Realizado"}\n\n` +
    `Aguardo a entrega dos créditos. Obrigado!`
  );

  const whatsappLink = `https://wa.me/${adminWhatsApp}?text=${whatsappMessage}`;

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8 animate-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Solicitação Enviada!
          </h1>
          
          <p className="text-muted-foreground mb-8">
            A sua solicitação de {data.creditsAmount} créditos foi recebida com sucesso. 
            {data.isFreeRequest 
              ? " Por ser a sua primeira solicitação, ela é gratuita!" 
              : " Estamos a verificar o seu pagamento."}
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border mb-8 text-left animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="font-display font-semibold text-foreground mb-4">
            Resumo da Solicitação
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nome:</span>
              <span className="font-medium text-foreground">{data.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">WhatsApp:</span>
              <span className="font-medium text-foreground">{data.whatsapp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Créditos:</span>
              <span className="font-medium text-foreground">{data.creditsAmount} créditos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo:</span>
              <span className={`font-medium ${data.isFreeRequest ? "text-primary" : "text-secondary"}`}>
                {data.isFreeRequest ? "Gratuita" : "Pagamento Pendente"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-accent border border-primary/20 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-sm text-accent-foreground">
            ⏱️ Os créditos serão entregues em até <strong>12 horas</strong> após a validação pelo administrador.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Button
            variant="hero"
            size="lg"
            onClick={() => window.open(whatsappLink, "_blank")}
            className="group"
          >
            <MessageCircle className="w-5 h-5" />
            Contactar no WhatsApp
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onBackHome}
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    </section>
  );
};
