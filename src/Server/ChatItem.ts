// types.ts or models.ts
export interface ChatItem {
    user: string;
    content: string;
    timestamp: number | { _seconds: number; _nanoseconds: number };
}

export interface NormalizedChatItem extends ChatItem {
    normalizedTimestamp: number;
}
