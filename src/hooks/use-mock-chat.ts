"use client";

import { create } from "zustand";
import { mockChats, mockMessages } from "@/lib/mock-data";
import type { Chat, Message } from "@/lib/types";

interface ChatState {
  chats: Chat[];
  getChat: (chatId: string) => Chat | undefined;
  getMessages: (chatId: string) => Message[];
  addMessage: (chatId: string, message: Message) => void;
  createChat: (chat: Chat) => void;
}

export const useMockChat = create<ChatState>()((set, get) => ({
  chats: mockChats,
  getChat: (chatId: string) => get().chats.find((c) => c.id === chatId),
  getMessages: (chatId: string) =>
    mockMessages.filter((m) => m.chatId === chatId),
  addMessage: (_chatId: string, _message: Message) => {
    // Mock: messages are static for now
  },
  createChat: (chat: Chat) => {
    set((state) => ({ chats: [chat, ...state.chats] }));
  },
}));
