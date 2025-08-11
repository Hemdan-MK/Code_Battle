// One message in any channel
export interface Message {
    id: string;               // uuid
    from: string;             // userId or "system"
    content: string;
    ts: number;               // unix epoch ms
}

// IndividualChats:  1‑to‑1 rooms  ➜  key = partnerUserId
// MatchChats:       each matchId has two channels: "team" and "all"
export interface ChatState {
    individual: Record<string, Message[]>;                  // { "bobId": [msg, ...] }
    match: Record<string, { team: Message[]; all: Message[] }>; // { "match42": { team:[…], all:[…] } }
}
