import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const reviews = [
  { id: 1, customer: "Marie Dupont", rating: 5, comment: "Excellent produit, livraison rapide !", date: "15 Jan 2025", product: "Chaussures de sport" },
  { id: 2, customer: "Jean Martin", rating: 4, comment: "Très satisfait, conforme à la description.", date: "14 Jan 2025", product: "T-shirt blanc" },
  { id: 3, customer: "Sophie Bernard", rating: 5, comment: "Parfait ! Je recommande vivement.", date: "13 Jan 2025", product: "Sac à dos" },
  { id: 4, customer: "Pierre Dubois", rating: 3, comment: "Correct, mais délai un peu long.", date: "12 Jan 2025", product: "Casquette rouge" },
];

export default function Reviews() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Avis clients</h1>
        <p className="text-muted-foreground">Consultez et répondez aux avis</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Note moyenne</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-4xl font-bold text-foreground">4.7</p>
              <Star className="h-8 w-8 fill-warning text-warning" />
            </div>
            <p className="text-sm text-muted-foreground">Sur 342 avis</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Avis positifs</p>
            <p className="text-4xl font-bold text-success mb-2">98%</p>
            <p className="text-sm text-muted-foreground">335 avis</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">En attente de réponse</p>
            <p className="text-4xl font-bold text-warning mb-2">3</p>
            <p className="text-sm text-muted-foreground">Avis récents</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{review.customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{review.customer}</p>
                      <p className="text-sm text-muted-foreground">{review.product}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-warning text-warning"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>

                <p className="text-sm text-foreground">{review.comment}</p>

                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Répondre
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
