import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

interface HeroProps {
  onRequestClick: () => void;
}

export const Hero = ({ onRequestClick }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium text-muted-foreground">Plataforma #1 em Angola</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
          <span className="text-foreground">Créditos </span>
          <span className="text-gradient">Lovable</span>
          <br />
          <span className="text-foreground">de Forma </span>
          <span className="text-gradient">Fácil</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Solicite créditos Lovable de forma rápida e segura. 
          Pagamento via Multicaixa Express ou BAI. 
          Entrega em até 12 horas.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button 
            variant="hero" 
            size="xl" 
            onClick={onRequestClick}
            className="group"
          >
            Solicitar Créditos Agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="glass" size="lg">
            Saiba Mais
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium">Entrega Rápida</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">100% Seguro</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium">Suporte 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
};
