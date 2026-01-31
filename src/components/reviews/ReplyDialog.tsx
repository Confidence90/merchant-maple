// src/components/reviews/ReplyDialog.tsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare } from "lucide-react";
import { cn } from '@/lib/utils';

interface ReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewId: number | null;
  onReply: (reviewId: number, reply: string) => Promise<void>;
  loading: boolean;
  suggestedResponses: Array<{
    id: number;
    template: string;
    for_rating: number[];
  }>;
}

export function ReplyDialog({
  open,
  onOpenChange,
  reviewId,
  onReply,
  loading,
  suggestedResponses,
}: ReplyDialogProps) {
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reviewId || !reply.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onReply(reviewId, reply);
      setReply('');
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const useTemplate = (template: string) => {
    setReply(template);
  };

  if (!reviewId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Répondre à l'avis</DialogTitle>
          <DialogDescription>
            Votre réponse sera visible par tous les clients.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Réponses suggérées */}
          {suggestedResponses.length > 0 && (
            <div className="space-y-2">
              <Label>Réponses suggérées</Label>
              <div className="space-y-2">
                {suggestedResponses.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => useTemplate(suggestion.template)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium">Modèle {suggestion.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.for_rating.map(r => `${r}★`).join(', ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {suggestion.template}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Zone de texte */}
          <div className="space-y-2">
            <Label htmlFor="reply">Votre réponse</Label>
            <Textarea
              id="reply"
              placeholder="Écrivez votre réponse ici..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {reply.length}/1000 caractères
            </p>
          </div>

          {/* Conseils */}
          <div className="rounded-lg bg-muted/30 p-3">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-medium">Conseils pour répondre</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Soyez professionnel et courtois</li>
                  <li>• Remerciez le client pour son avis</li>
                  <li>• Adressez les préoccupations spécifiques</li>
                  <li>• Proposez de l'aide si nécessaire</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reply.trim() || isSubmitting || loading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              'Envoyer la réponse'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}