
import { useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pet } from "@/components/PetCard";
import { useMessages } from "@/hooks/useMessages";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMatch: Pet | null;
  matchId: string | null;
  userId: string | null;
}

const ChatDialog = ({
  open,
  onOpenChange,
  selectedMatch,
  matchId,
  userId
}: ChatDialogProps) => {
  const { messages, sendMessage } = useMessages(matchId, userId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatMessage, setChatMessage] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    await sendMessage(chatMessage);
    setChatMessage("");
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedMatch && (
              <>
                <img 
                  src={selectedMatch.imageUrl}
                  alt={selectedMatch.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>Chat with {selectedMatch.name}</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {selectedMatch && `Owner: ${selectedMatch.ownerName}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gray-50 rounded p-3 h-60 mb-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 text-sm p-3">
              Start chatting with {selectedMatch?.name}'s owner to arrange a playdate!
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`p-2 rounded-lg max-w-[80%] ${
                    message.sender_id === userId 
                      ? 'bg-petpals-purple text-white self-end rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 self-start rounded-bl-none'
                  }`}
                >
                  <div>{message.content}</div>
                  <div className={`text-xs ${message.sender_id === userId ? 'text-purple-100' : 'text-gray-500'} text-right`}>
                    {formatMessageTime(message.created_at)}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-petpals-purple hover:bg-petpals-purple/90"
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
