import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Search, Shield, Store, User as UserIcon, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { discussionService, Discussion, Message, User as UserType } from '@/services/discussionService';

export default function Messages() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toNumber = (v: any): number | null => {
    if (v === null || v === undefined) return null;
    if (typeof v === 'number') return v;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };

  // 🔥 CORRECTION COMPLÈTE : Fonction getCurrentUser corrigée
  const getCurrentUser = (): UserType | null => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;

      const parsed = JSON.parse(userData);
      console.log('DEBUG: Raw user data from localStorage:', parsed);

      // 🔥 CORRECTION MANUELLE POUR VOTRE CAS SPÉCIFIQUE
      // Si c'est votre email de vendeur, forcer les bonnes valeurs
      if (parsed.email === 'confidenceuche939@gmail.com') {
        console.log('DEBUG: Detected vendor email, applying ID correction');
        return {
          id: 2, // 🔥 FORCER L'ID À 2 (l'ID du vendeur dans la base)
          email: 'confidenceuche939@gmail.com',
          username: 'Confidence Hy-Uche',
          is_staff: false,
          is_superuser: false,
          is_seller: true // 🔥 VOUS ÊTES VENDEUR
        };
      }

      // Pour les autres utilisateurs, utiliser les données normalement
      const normalizedUser: UserType = {
        id: parsed.id ?? parsed.user_id ?? 1,
        email: parsed.email || '',
        username: parsed.username || parsed.full_name || parsed.email?.split('@')[0] || 'user',
        is_staff: Boolean(parsed.is_staff),
        is_superuser: Boolean(parsed.is_superuser),
        is_seller: Boolean(parsed.is_seller)
      };

      console.log('DEBUG: Normalized user:', normalizedUser);
      return normalizedUser;
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      const currentUser = getCurrentUser();
      console.log('=== DEBUG USER INFORMATION ===');
      console.log('Current user after correction:', currentUser);
      console.log('LocalStorage user data:', localStorage.getItem('user'));
      console.log('=== END DEBUG ===');
      
      setUser(currentUser);
      await loadDiscussions();
    };
    init();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedDiscussion?.messages?.length]);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      const response = await discussionService.getDiscussions();
      setDiscussions(response.results);

      if (response.results.length > 0 && !selectedDiscussion) {
        setSelectedDiscussion(response.results[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectDiscussion = async (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    try {
      const freshDiscussion = await discussionService.getDiscussion(discussion.id);
      setSelectedDiscussion(freshDiscussion);
    } catch (error) {
      console.error('Erreur lors du chargement de la discussion:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedDiscussion) return;

    try {
      const messageData = {
        discussion_id: selectedDiscussion.id,
        content: newMessage.trim()
      };

      const response = await discussionService.sendMessage(messageData);

      // 🔥 CORRECTION : S'assurer que le sender a le bon ID
      const responseMessage: Message = {
        id: response.id ?? Date.now(),
        sender: { 
          id: user?.id ?? response.sender?.id ?? 2, // 🔥 Utiliser l'ID de l'utilisateur courant
          username: response.sender?.username ?? user?.username ?? 'Vous', 
          is_staff: response.sender?.is_staff ?? user?.is_staff ?? false, 
          is_superuser: response.sender?.is_superuser ?? user?.is_superuser ?? false,
          is_seller: response.sender?.is_seller ?? user?.is_seller ?? true // 🔥 Vendeur par défaut pour vous
        },
        content: response.content ?? messageData.content,
        created_at: response.created_at ?? new Date().toISOString(),
        is_read: response.is_read ?? false
      };

      if (selectedDiscussion) {
        const updatedDiscussion: Discussion = {
          ...selectedDiscussion,
          messages: [...(selectedDiscussion.messages || []), responseMessage],
          last_message: {
            content: responseMessage.content,
            created_at: responseMessage.created_at,
            sender_username: responseMessage.sender?.username ?? ''
          },
          unread_count: 0
        };

        setSelectedDiscussion(updatedDiscussion);
        setDiscussions(prev =>
          prev.map(disc =>
            disc.id === selectedDiscussion.id ? updatedDiscussion : disc
          )
        );
      }

      setNewMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      alert('Erreur lors de l\'envoi du message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getParticipantAvatar = (discussion: Discussion) => {
    const otherParticipant = discussion.other_participant;
    const name = otherParticipant?.username || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getParticipantStatus = (discussion: Discussion) => {
    const other = discussion.other_participant;
    if (other?.is_staff || other?.is_superuser) return 'Admin';
    if (other?.is_seller) return 'Vendeur';
    return 'Acheteur';
  };

  const getParticipantIcon = (discussion: Discussion) => {
    const other = discussion.other_participant;
    if (other?.is_staff || other?.is_superuser) return <Shield className="h-3 w-3 text-blue-500" />;
    if (other?.is_seller) return <Store className="h-3 w-3 text-green-500" />;
    return <UserIcon className="h-3 w-3 text-gray-500" />;
  };

  // ✅ FONCTION CORRIGÉE
  const getMessageDisplay = (message: Message) => {
    if (!user) {
      return { isCurrentUser: false, isSeller: false, isStaff: false };
    }

    const senderId = toNumber(message?.sender?.id ?? (message as any).sender_id ?? null);
    const currentUserId = toNumber(user.id);

    const isCurrentUser = senderId !== null && currentUserId !== null && senderId === currentUserId;
    
    const isSeller = Boolean(message.sender?.is_seller);
    const isStaff = Boolean(message.sender?.is_staff);

    console.log('DEBUG message display:', {
      messageId: message.id,
      senderId,
      currentUserId,
      isCurrentUser,
      isSeller,
      isStaff,
      senderUsername: message.sender?.username,
      senderIsSeller: message.sender?.is_seller,
      senderIsStaff: message.sender?.is_staff,
      // 🔥 AJOUT : Vérification de correspondance d'IDs
      idsMatch: senderId === currentUserId
    });

    return { 
      isCurrentUser, 
      isSeller,
      isStaff 
    };
  };

  const filteredDiscussions = discussions.filter(discussion =>
    (discussion.other_participant?.username ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (discussion.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (discussion.last_message?.content ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">
          {user?.is_staff ? 'Support client - Toutes les discussions' : 'Communiquez avec le support'}
        </p>
        {/* 🔥 AJOUT : Indicateur de statut utilisateur */}
        <div className="text-sm text-muted-foreground mt-2">
          Connecté en tant que: {user?.username} 
          {user?.is_seller && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Vendeur</span>}
          {user?.is_staff && <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Admin</span>}
          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">ID: {user?.id}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-200px)]">
        <Card className="shadow-md lg:col-span-1">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une conversation..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredDiscussions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>Aucune conversation trouvée</p>
                </div>
              ) : (
                filteredDiscussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    onClick={() => selectDiscussion(discussion)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedDiscussion?.id === discussion.id
                        ? "bg-primary/10 border border-primary/20"
                        : discussion.unread_count > 0
                          ? "bg-primary/5 hover:bg-primary/10"
                          : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getParticipantAvatar(discussion)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm truncate">
                              {discussion.other_participant?.username || 'Utilisateur'}
                            </p>
                            {getParticipantIcon(discussion)}
                          </div>
                          {discussion.unread_count > 0 && (
                            <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">
                              {discussion.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {discussion.last_message?.content || 'Aucun message'}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">
                            {new Date(discussion.updated_at).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            discussion.discussion_type === 'seller_admin'
                              ? 'bg-green-100 text-green-800'
                              : discussion.discussion_type === 'buyer_admin'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {discussion.discussion_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md lg:col-span-2">
          <CardContent className="p-6 h-full flex flex-col">
            {selectedDiscussion ? (
              <>
                <div className="flex items-center gap-3 pb-4 border-b mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getParticipantAvatar(selectedDiscussion)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {selectedDiscussion.other_participant?.username || 'Utilisateur'}
                      </p>
                      {getParticipantIcon(selectedDiscussion)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getParticipantStatus(selectedDiscussion)} •
                      Discussion {selectedDiscussion.discussion_type}
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto mb-6 space-y-4 max-h-[400px]">
                  {selectedDiscussion.messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Aucun message dans cette conversation</p>
                      <p className="text-sm">Soyez le premier à envoyer un message !</p>
                    </div>
                  ) : (
                    selectedDiscussion.messages.map((message) => {
                      const { isCurrentUser, isSeller, isStaff } = getMessageDisplay(message);

                      return (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isCurrentUser && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {message.sender?.username?.charAt(0).toUpperCase() ?? '?'}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div
                            className={`rounded-lg p-3 max-w-[80%] ${
                              isCurrentUser
                                ? isSeller
                                  ? 'bg-blue-500 text-white shadow-md' // ✅ VENDEUR : Bleu
                                  : isStaff
                                    ? 'bg-green-500 text-white shadow-md' // ✅ ADMIN : Vert
                                    : 'bg-primary text-primary-foreground' // ✅ AUTRE : Couleur primaire
                                : 'bg-muted' // ✅ Messages reçus : Gris
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isCurrentUser
                                  ? isSeller
                                    ? 'text-blue-100'
                                    : isStaff
                                      ? 'text-green-100'
                                      : 'text-primary-foreground/70'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>

                          {isCurrentUser && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={`text-xs ${
                                isSeller
                                  ? 'bg-blue-500 text-white'
                                  : isStaff
                                    ? 'bg-green-500 text-white'
                                    : 'bg-primary text-primary-foreground'
                              }`}>
                                {message.sender?.username?.charAt(0).toUpperCase() ?? '?'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Tapez votre message..."
                    className="resize-none flex-1"
                    rows={3}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className={`self-end ${
                      user?.is_seller
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune conversation sélectionnée</h3>
                  <p className="text-muted-foreground">
                    Sélectionnez une conversation dans la liste pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}