import { Check, Sparkles, Zap, Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditPackagesProps {
  selectedAmount: number | null;
  onSelect: (amount: number) => void;
  isFreeRequest: boolean;
}

const packages = [
  {
    amount: 10,
    price: "750 Kz",
    priceUsd: "~$0.80",
    popular: false,
    icon: Zap,
    tier: "starter",
    features: ["10 Créditos Lovable", "Suporte básico", "Entrega em 12h"],
  },
  {
    amount: 20,
    price: "1.500 Kz",
    priceUsd: "~$1.60",
    popular: true,
    icon: Star,
    tier: "popular",
    features: ["20 Créditos Lovable", "Suporte prioritário", "Entrega em 6h", "Bónus +2 créditos"],
  },
  {
    amount: 50,
    price: "3.500 Kz",
    priceUsd: "~$3.80",
    popular: false,
    icon: Crown,
    tier: "premium",
    features: ["50 Créditos Lovable", "Suporte VIP", "Entrega em 3h", "Bónus +5 créditos"],
  },
];

export const CreditPackages = ({ selectedAmount, onSelect, isFreeRequest }: CreditPackagesProps) => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Pacotes de Créditos
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Escolha o Seu <span className="text-gradient">Pacote</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {isFreeRequest 
              ? "🎉 Primeira solicitação gratuita com seu link de convite!" 
              : "Selecione a quantidade de créditos que deseja adquirir"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => {
            const isSelected = selectedAmount === pkg.amount;
            const IconComponent = pkg.icon;
            
            return (
              <button
                key={pkg.amount}
                onClick={() => onSelect(pkg.amount)}
                className={cn(
                  "relative p-8 rounded-3xl text-left transition-all duration-500 group",
                  "animate-slide-up",
                  isSelected
                    ? "scale-105 z-10"
                    : "hover:scale-[1.02] hover:-translate-y-2",
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card background */}
                <div className={cn(
                  "absolute inset-0 rounded-3xl transition-all duration-500",
                  isSelected
                    ? pkg.tier === "popular" 
                      ? "bg-gradient-to-br from-primary via-primary to-primary-glow shadow-glow"
                      : pkg.tier === "premium"
                        ? "bg-gradient-to-br from-secondary via-secondary to-amber-400 shadow-[0_0_40px_hsl(42_95%_58%/0.3)]"
                        : "bg-gradient-teal shadow-glow"
                    : "glass shadow-card group-hover:shadow-lg"
                )} />

                {/* Shimmer effect on hover */}
                {!isSelected && (
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" 
                      style={{ backgroundSize: '200% 100%' }} />
                  </div>
                )}

                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg",
                      isSelected 
                        ? "bg-card text-primary" 
                        : "bg-gradient-gold text-secondary-foreground"
                    )}>
                      <Sparkles className="w-3.5 h-3.5" />
                      Mais Popular
                    </span>
                  </div>
                )}

                {/* Premium badge */}
                {pkg.tier === "premium" && !pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg",
                      isSelected 
                        ? "bg-card text-secondary" 
                        : "bg-gradient-to-r from-amber-400 to-orange-400 text-secondary-foreground"
                    )}>
                      <Crown className="w-3.5 h-3.5" />
                      Melhor Valor
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300",
                    isSelected 
                      ? "bg-primary-foreground/20" 
                      : pkg.tier === "popular" 
                        ? "bg-primary/10" 
                        : pkg.tier === "premium" 
                          ? "bg-secondary/10" 
                          : "bg-accent"
                  )}>
                    <IconComponent className={cn(
                      "w-7 h-7 transition-colors duration-300",
                      isSelected 
                        ? "text-primary-foreground" 
                        : pkg.tier === "popular" 
                          ? "text-primary" 
                          : pkg.tier === "premium" 
                            ? "text-secondary" 
                            : "text-primary"
                    )} />
                  </div>

                  {/* Credits amount */}
                  <div className="mb-2">
                    <span className={cn(
                      "text-5xl font-display font-extrabold tracking-tight",
                      isSelected 
                        ? "text-primary-foreground" 
                        : "text-gradient"
                    )}>
                      {pkg.amount}
                    </span>
                    <span className={cn(
                      "text-lg font-medium ml-2",
                      isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      créditos
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    {isFreeRequest ? (
                      <div className="flex items-baseline gap-2">
                        <span className={cn(
                          "text-3xl font-bold",
                          isSelected ? "text-primary-foreground" : "text-foreground"
                        )}>
                          Grátis
                        </span>
                        <span className={cn(
                          "text-sm line-through",
                          isSelected ? "text-primary-foreground/50" : "text-muted-foreground"
                        )}>
                          {pkg.price}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className={cn(
                          "text-3xl font-bold",
                          isSelected ? "text-primary-foreground" : "text-foreground"
                        )}>
                          {pkg.price}
                        </span>
                        <span className={cn(
                          "text-sm",
                          isSelected ? "text-primary-foreground/60" : "text-muted-foreground"
                        )}>
                          {pkg.priceUsd}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className={cn(
                    "h-px w-full mb-6",
                    isSelected ? "bg-primary-foreground/20" : "bg-border"
                  )} />

                  {/* Features */}
                  <ul className="space-y-4">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                          isSelected 
                            ? "bg-primary-foreground/20" 
                            : pkg.tier === "popular" 
                              ? "bg-primary/10" 
                              : pkg.tier === "premium" 
                                ? "bg-secondary/10" 
                                : "bg-accent"
                        )}>
                          <Check className={cn(
                            "w-3 h-3",
                            isSelected 
                              ? "text-primary-foreground" 
                              : pkg.tier === "popular" 
                                ? "text-primary" 
                                : pkg.tier === "premium" 
                                  ? "text-secondary" 
                                  : "text-primary"
                          )} />
                        </div>
                        <span className={cn(
                          "text-sm",
                          isSelected ? "text-primary-foreground/90" : "text-muted-foreground"
                        )}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-6 right-6">
                      <div className="w-8 h-8 rounded-full bg-primary-foreground flex items-center justify-center shadow-lg animate-fade-in">
                        <Check className={cn(
                          "w-5 h-5",
                          pkg.tier === "premium" ? "text-secondary" : "text-primary"
                        )} />
                      </div>
                    </div>
                  )}

                  {/* Select button */}
                  <div className={cn(
                    "mt-8 py-3 px-6 rounded-xl text-center font-semibold transition-all duration-300",
                    isSelected 
                      ? "bg-primary-foreground text-primary shadow-lg"
                      : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                  )}>
                    {isSelected ? "Selecionado" : "Selecionar"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
