
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export const useMessages = (matchId: string | null, userId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!matchId || !userId) return;

    const fetchMessages = async () => {
      try {
        // Fetch all messages for a specific match
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('match_id', matchId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      }
    };

    fetchMessages();

    // Subscribe to new messages using Supabase's realtime feature
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          // Add new message to state when received
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      // Clean up realtime subscription
      supabase.removeChannel(channel);
    };
  }, [matchId, userId, toast]);

  const sendMessage = async (content: string) => {
    if (!matchId || !userId || !content.trim()) return;
    
    try {
      // Insert new message into the messages table
      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          sender_id: userId,
          content: content.trim()
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { messages, sendMessage };
};
