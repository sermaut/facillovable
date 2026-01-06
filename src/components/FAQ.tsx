import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "O que são créditos Lovable?",
    answer: "Os créditos Lovable são a moeda virtual usada na plataforma Lovable.dev para criar e desenvolver aplicativos web com inteligência artificial. Cada ação de desenvolvimento consome uma certa quantidade de créditos."
  },
  {
    question: "Como funciona o processo de compra?",
    answer: "É simples! Escolha o pacote de créditos desejado, preencha o formulário com os seus dados, faça o pagamento via transferência bancária e envie o comprovativo. Em até 12 horas, os créditos serão adicionados à sua conta Lovable."
  },
  {
    question: "Quais são os métodos de pagamento aceites?",
    answer: "Aceitamos transferência bancária e pagamentos via Multicaixa Express. Após o pagamento, basta enviar o comprovativo pelo formulário de solicitação."
  },
  {
    question: "Quanto tempo demora a receber os créditos?",
    answer: "Após a confirmação do pagamento, os créditos são entregues em até 12 horas. Para pacotes maiores, a entrega pode ser ainda mais rápida (6h para 20 créditos e 3h para 50 créditos)."
  },
  {
    question: "O que é a primeira solicitação gratuita?",
    answer: "Cada link de convite Lovable dá direito a uma solicitação gratuita de 10 créditos. É a nossa forma de ajudar novos utilizadores a começarem na plataforma sem custos!"
  },
  {
    question: "Posso solicitar mais créditos depois?",
    answer: "Sim! Pode solicitar créditos quantas vezes quiser. Apenas a primeira solicitação por link de convite é gratuita. As demais seguem os preços dos pacotes disponíveis."
  },
  {
    question: "É seguro fazer pagamentos aqui?",
    answer: "Absolutamente! O Facillovable é um serviço confiável de revenda de créditos Lovable em Angola. Mantemos registos de todas as transações e oferecemos suporte via WhatsApp."
  },
  {
    question: "Como posso entrar em contacto?",
    answer: "Pode contactar-nos diretamente pelo WhatsApp. Após submeter a sua solicitação, terá a opção de iniciar uma conversa connosco para acompanhar o seu pedido."
  }
];

export const FAQ = () => {
  return (
    <section className="py-20 px-4" id="faq">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tire as suas dúvidas sobre o serviço Facillovable
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-xl px-6 data-[state=open]:ring-2 data-[state=open]:ring-primary/20 transition-all duration-300"
            >
              <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
