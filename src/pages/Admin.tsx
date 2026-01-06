import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { 
  CheckCircle, 
  Clock, 
  Package, 
  XCircle, 
  LogOut, 
  Eye,
  RefreshCw,
  Search
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type CreditRequest = Database["public"]["Tables"]["credit_requests"]["Row"];

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<CreditRequest[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Check if user is admin
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (roleData) {
        setIsAuthenticated(true);
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Conta criada!",
        description: "Conta criada com sucesso. Agora faça login.",
      });
      setIsSignUp(false);
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .single();

      if (roleError || !roleData) {
        await supabase.auth.signOut();
        throw new Error("Acesso não autorizado. Apenas administradores podem aceder.");
      }

      setIsAuthenticated(true);
      toast({
        title: "Bem-vindo!",
        description: "Login realizado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setRequests([]);
  };

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("credit_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setRequests(data || []);
  };

  const updateStatus = async (id: string, status: "pending" | "paid" | "delivered" | "cancelled") => {
    const { error } = await supabase
      .from("credit_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Status atualizado",
      description: `Solicitação marcada como ${status}`,
    });
    fetchRequests();
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-secondary/20 text-secondary-foreground border-secondary",
      paid: "bg-primary/20 text-primary border-primary",
      delivered: "bg-green-500/20 text-green-700 border-green-500",
      cancelled: "bg-destructive/20 text-destructive border-destructive",
    };

    const icons: Record<string, React.ReactNode> = {
      pending: <Clock className="w-3 h-3" />,
      paid: <CheckCircle className="w-3 h-3" />,
      delivered: <Package className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />,
    };

    const labels: Record<string, string> = {
      pending: "Pendente",
      paid: "Pago",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const filteredRequests = requests.filter((req) => {
    const matchesFilter = filter === "all" || req.status === filter;
    const matchesSearch = 
      req.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.whatsapp.includes(searchTerm) ||
      req.invite_link.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <h1 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
                {isSignUp ? "Criar Conta Admin" : "Painel Admin"}
              </h1>
              
              <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Aguarde..." : (isSignUp ? "Criar Conta" : "Entrar")}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-primary hover:underline"
                >
                  {isSignUp ? "Já tem conta? Fazer login" : "Criar nova conta"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-28 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Painel de Gestão
              </h1>
              <p className="text-muted-foreground">
                Gerencie as solicitações de créditos
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchRequests}>
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{requests.length}</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold text-secondary">{requests.filter(r => r.status === "pending").length}</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-sm text-muted-foreground">Pagos</p>
              <p className="text-2xl font-bold text-primary">{requests.filter(r => r.status === "paid").length}</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-sm text-muted-foreground">Entregues</p>
              <p className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === "delivered").length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome, WhatsApp ou link..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "paid", "delivered", "cancelled"].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                >
                  {status === "all" ? "Todos" : getStatusBadge(status)}
                </Button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">WhatsApp</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Créditos</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Tipo</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Data</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{req.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{req.invite_link}</p>
                      </td>
                      <td className="p-4 text-muted-foreground">{req.whatsapp}</td>
                      <td className="p-4 font-medium text-foreground">{req.credits_amount}</td>
                      <td className="p-4">
                        <span className={`text-xs font-medium ${req.is_free_request ? "text-primary" : "text-secondary"}`}>
                          {req.is_free_request ? "Gratuito" : "Pago"}
                        </span>
                      </td>
                      <td className="p-4">{getStatusBadge(req.status)}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(req.created_at).toLocaleDateString("pt-AO")}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {req.payment_proof_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(req.payment_proof_url!, "_blank")}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          {req.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateStatus(req.id, "paid")}
                            >
                              Confirmar
                            </Button>
                          )}
                          {req.status === "paid" && (
                            <Button
                              size="sm"
                              onClick={() => updateStatus(req.id, "delivered")}
                            >
                              Entregar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredRequests.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                Nenhuma solicitação encontrada
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
