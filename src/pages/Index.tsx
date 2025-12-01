import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Store, Package, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-black  border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
  VC
</div>

            <span className="font-bold bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent ml-3">VENDOR CENTER</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-smooth">
              Dashboard
            </Link>
            <Link to="/profile" className="text-muted-foreground hover:text-primary transition-smooth">
              Configuration
            </Link>
            <Link to="/publier" className="text-muted-foreground hover:text-primary transition-smooth">
              Publier
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Lancez votre boutique en ligne avec 
            <span className="bg-gradient-to-r from-purple-400 to-purple-700 bg-clip-text text-transparent ml-3">
  E-sugu Vendor Center
</span>

          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            La plateforme complète pour gérer votre activité de vente en ligne. 
            Créez des produits, suivez vos performances et développez votre business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="black hover:opacity-90">
                <Store className="w-5 h-5 mr-2" />
                Accéder au Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/orders">
              <Button size="lg" variant="secondary">
                <Package className="w-5 h-5 mr-2" />
                Voir les commandes
              </Button>
            </Link>
            <Link to="/profile">
              <Button size="lg" variant="outline">
                Configurer ma boutique
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Tout ce dont vous avez besoin pour vendre
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg shadow-card text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center text-white " />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Gestion des produits</h3>
              <p className="text-muted-foreground">
                Créez et gérez facilement vos annonces avec notre interface intuitive.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-card text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Suivi des performances</h3>
              <p className="text-muted-foreground">
                Analysez vos ventes et optimisez votre stratégie avec nos outils d'analyse.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg shadow-card text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Store className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Configuration boutique</h3>
              <p className="text-muted-foreground">
                Personnalisez votre boutique et configurez vos paramètres de vente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Prêt à commencer ?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Rejoignez des milliers de vendeurs qui font confiance à E-sugu
        </p>
        <Link to="/login">
          <Button size="lg" className="bg-black hover:opacity-90">
            Démarrer maintenant
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Index;
