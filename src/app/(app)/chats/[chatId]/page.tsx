import { redirect } from "next/navigation";
import { ChatView } from "@/components/chat/chat-view";
import { getUsageStatus } from "@/lib/ai/rate-limiter";
import { getChat, getCurrentUser, getMessages } from "@/lib/db/queries";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  const [chat, messages, user] = await Promise.all([
    getChat(chatId),
    getMessages(chatId),
    getCurrentUser(),
  ]);

  if (!chat || !user) redirect("/chats");

  const usage = await getUsageStatus(user.id);

  return (
    <ChatView chat={chat} initialMessages={messages} initialUsage={usage} />
  );
}
