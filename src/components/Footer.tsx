import { Sparkles, Shield, Clock, MessageCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Trust section */}
        <div id="faq" className="mb-16">
          <h3 className="font-display text-2xl font-bold text-foreground text-center mb-8">
            Política de Confiança
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-muted/50 border border-border">
              <Shield className="w-10 h-10 text-primary mb-4" />
              <h4 className="font-display font-semibold text-foreground mb-2">
                100% Seguro
              </h4>
              <p className="text-sm text-muted-foreground">
                Todos os pagamentos são verificados manualmente. Não compartilhamos seus dados com terceiros.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-muted/50 border border-border">
              <Clock className="w-10 h-10 text-secondary mb-4" />
              <h4 className="font-display font-semibold text-foreground mb-2">
                Entrega Garantida
              </h4>
              <p className="text-sm text-muted-foreground">
                Créditos entregues em até 12 horas após validação. Em caso de problemas, reembolso total.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-muted/50 border border-border">
              <MessageCircle className="w-10 h-10 text-primary mb-4" />
              <h4 className="font-display font-semibold text-foreground mb-2">
                Suporte Humanizado
              </h4>
              <p className="text-sm text-muted-foreground">
                Nossa equipe está disponível 24/7 via WhatsApp para tirar todas as suas dúvidas.
              </p>
            </div>
          </div>
        </div>

        {/* Legal notice */}
        <div className="p-6 rounded-2xl bg-accent/50 border border-primary/20 mb-12">
          <h4 className="font-display font-semibold text-foreground mb-3">
            Aviso Legal
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Facillovable é um serviço independente de intermediação para aquisição de créditos Lovable. 
            Não somos afiliados ou endossados pela Lovable Inc. Os preços podem variar conforme a taxa de câmbio. 
            Ao utilizar nossos serviços, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">
              Facil<span className="text-gradient">lovable</span>
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2025 Facillovable. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
