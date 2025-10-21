import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const conversations = [
  { id: 1, name: "Marie Dupont", lastMessage: "Quand sera expédié ma commande ?", time: "Il y a 5 min", unread: true },
  { id: 2, name: "Jean Martin", lastMessage: "Merci pour la livraison rapide !", time: "Il y a 1h", unread: false },
  { id: 3, name: "Sophie Bernard", lastMessage: "Le produit est-il disponible en bleu ?", time: "Il y a 2h", unread: true },
];

export default function Messages() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">Communiquez avec vos clients</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-md lg:col-span-1">
          <CardContent className="p-4">
            <Input placeholder="Rechercher une conversation..." className="mb-4" />
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    conv.unread ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>{conv.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm truncate">{conv.name}</p>
                        {conv.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conv.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 pb-4 border-b mb-4">
              <Avatar>
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Marie Dupont</p>
                <p className="text-xs text-muted-foreground">En ligne</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 min-h-[300px]">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>MD</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Bonjour, j'ai passé commande hier. Quand sera-t-elle expédiée ?</p>
                  <p className="text-xs text-muted-foreground mt-1">Il y a 5 min</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="bg-primary rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm text-primary-foreground">Bonjour ! Votre commande sera expédiée aujourd'hui. Vous recevrez un email de confirmation avec le numéro de suivi.</p>
                  <p className="text-xs text-primary-foreground/70 mt-1">Il y a 2 min</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Textarea placeholder="Tapez votre message..." className="resize-none" rows={3} />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
