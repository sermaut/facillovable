import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditPackagesProps {
  selectedAmount: number | null;
  onSelect: (amount: number) => void;
  isFreeRequest: boolean;
}

const packages = [
  {
    amount: 10,
    price: "2.500 Kz",
    priceUsd: "~$3",
    popular: false,
    features: ["10 Créditos Lovable", "Suporte básico", "Entrega em 12h"],
  },
  {
    amount: 20,
    price: "4.500 Kz",
    priceUsd: "~$5",
    popular: true,
    features: ["20 Créditos Lovable", "Suporte prioritário", "Entrega em 6h", "Bónus +2 créditos"],
  },
  {
    amount: 50,
    price: "10.000 Kz",
    priceUsd: "~$12",
    popular: false,
    features: ["50 Créditos Lovable", "Suporte VIP", "Entrega em 3h", "Bónus +5 créditos"],
  },
];

export const CreditPackages = ({ selectedAmount, onSelect, isFreeRequest }: CreditPackagesProps) => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Escolha o Seu Pacote
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {isFreeRequest 
              ? "🎉 Primeira solicitação gratuita com seu link de convite!" 
              : "Selecione a quantidade de créditos que deseja adquirir"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <button
              key={pkg.amount}
              onClick={() => onSelect(pkg.amount)}
              className={cn(
                "relative p-6 rounded-2xl text-left transition-all duration-300 group",
                selectedAmount === pkg.amount
                  ? "bg-primary text-primary-foreground shadow-glow scale-105"
                  : "bg-card shadow-card hover:shadow-lg hover:-translate-y-1 border border-border",
                pkg.popular && selectedAmount !== pkg.amount && "ring-2 ring-secondary"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-gold text-secondary-foreground text-xs font-bold">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <span className={cn(
                  "text-4xl font-display font-extrabold",
                  selectedAmount === pkg.amount ? "text-primary-foreground" : "text-gradient"
                )}>
                  {pkg.amount}
                </span>
                <span className={cn(
                  "text-lg font-medium ml-2",
                  selectedAmount === pkg.amount ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  créditos
                </span>
              </div>

              <div className="mb-6">
                {isFreeRequest ? (
                  <div>
                    <span className={cn(
                      "text-2xl font-bold",
                      selectedAmount === pkg.amount ? "text-primary-foreground" : "text-foreground"
                    )}>
                      Grátis
                    </span>
                    <span className={cn(
                      "text-sm ml-2 line-through",
                      selectedAmount === pkg.amount ? "text-primary-foreground/60" : "text-muted-foreground"
                    )}>
                      {pkg.price}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className={cn(
                      "text-2xl font-bold",
                      selectedAmount === pkg.amount ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {pkg.price}
                    </span>
                    <span className={cn(
                      "text-sm ml-2",
                      selectedAmount === pkg.amount ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {pkg.priceUsd}
                    </span>
                  </div>
                )}
              </div>

              <ul className="space-y-3">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className={cn(
                      "w-4 h-4",
                      selectedAmount === pkg.amount ? "text-primary-foreground" : "text-primary"
                    )} />
                    <span className={cn(
                      "text-sm",
                      selectedAmount === pkg.amount ? "text-primary-foreground/90" : "text-muted-foreground"
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {selectedAmount === pkg.amount && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
