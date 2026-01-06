import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { RequestForm } from "@/components/RequestForm";
import { SuccessMessage } from "@/components/SuccessMessage";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

interface SuccessData {
  fullName: string;
  whatsapp: string;
  inviteLink: string;
  creditsAmount: number;
  isFreeRequest: boolean;
}

const Index = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const scrollToForm = () => {
    document.getElementById("request-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSuccess = (data: SuccessData) => {
    setSuccessData(data);
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackHome = () => {
    setShowSuccess(false);
    setSuccessData(null);
  };

  if (showSuccess && successData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SuccessMessage data={successData} onBackHome={handleBackHome} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero onRequestClick={scrollToForm} />
      <RequestForm onSuccess={handleSuccess} />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
