import { Header } from "@/components/layout/header";
import { ChatListSkeleton } from "@/components/skeletons/chat-list-skeleton";

export default function ChatsLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="Chats" />
      <ChatListSkeleton />
    </div>
  );
}
