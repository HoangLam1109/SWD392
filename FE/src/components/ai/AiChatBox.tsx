import { useState } from "react";
import { useAI } from "@/hooks/ai/useAI";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const AiChatBox = () => {
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { mutate: sendQuery, isPending } = useAI();

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    sendQuery(
      { query: trimmed, sessionId },
      {
        onSuccess: (data) => {
          setSessionId(data.sessionId);
          const botMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.content,
          };
          setMessages((prev) => [...prev, botMessage]);
        },
      }
    );
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`flex flex-col w-full max-w-md border border-gray-200 rounded-xl bg-white shadow-sm ${
        isCollapsed ? "h-auto" : "h-[450px]"
      }`}
    >
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
        <div className="font-semibold text-gray-800">AI Assistant</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:inline">
            {isPending ? "Đang trả lời..." : "Sẵn sàng"}
          </span>
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-xs px-2 py-1 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100"
          >
            {isCollapsed ? "＋" : "－"}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-sm">
            {messages.length === 0 && (
              <div className="text-gray-400 text-center text-xs mt-4">
                Hãy nhập câu hỏi để bắt đầu trò chuyện với AI.
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-3 py-2 max-w-[80%] whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 py-3 border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Hỏi AI bất cứ điều gì..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isPending || !input.trim()}
              className="px-4 py-2 text-sm font-medium rounded-full bg-blue-600 text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AiChatBox;

