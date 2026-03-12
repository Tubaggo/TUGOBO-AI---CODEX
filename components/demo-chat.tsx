"use client";

import { MessageCircleMore, Send } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { simulationReplies, whatsappScript, type DemoMessage } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type DemoChatProps = {
  onScenarioChange: (summary: string) => void;
};

const replyMap: Record<string, DemoMessage[]> = {
  "Ask for breakfast included": [
    ...whatsappScript,
    {
      id: "m5",
      sender: "guest",
      body: "Please include breakfast in the quote.",
      time: "10:14",
    },
    {
      id: "m6",
      sender: "assistant",
      body: "Done. I prepared a breakfast-included option and marked it as ready for the reservations team.",
      time: "10:14",
    },
  ],
  "Add airport transfer": [
    ...whatsappScript,
    {
      id: "m5",
      sender: "assistant",
      body: "I added private airport transfer and included it in the lead for the hotel team.",
      time: "10:14",
    },
  ],
  "Request a refundable rate": [
    ...whatsappScript,
    {
      id: "m5",
      sender: "guest",
      body: "Can you make it refundable?",
      time: "10:14",
    },
    {
      id: "m6",
      sender: "assistant",
      body: "Yes. I prepared a refundable offer with free cancellation up to 72 hours before check-in.",
      time: "10:14",
    },
  ],
};

export function DemoChat({ onScenarioChange }: DemoChatProps) {
  const [selectedReply, setSelectedReply] = useState(simulationReplies[0]);
  const messages = useMemo(() => replyMap[selectedReply] ?? whatsappScript, [selectedReply]);

  return (
    <Card className="overflow-hidden border-[#d6e6dc] bg-[#e7f0ea] shadow-[0_20px_60px_rgba(22,56,50,0.14)]">
      <CardHeader className="border-b border-[#d6e6dc] bg-[#0f3f38] text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
              <MessageCircleMore className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">WhatsApp Reservation Demo</CardTitle>
              <p className="text-sm text-emerald-50/70">Sea Breeze Bodrum • online now</p>
            </div>
          </div>
          <Badge className="bg-white/10 text-white">Live simulation</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 p-0">
        <div className="flex flex-wrap gap-2 border-b border-[#d6e6dc] bg-white px-5 py-4">
          <Badge variant="outline">Name: Amelia Carter</Badge>
          <Badge variant="outline">Dates: Apr 18 - Apr 22</Badge>
          <Badge variant="outline">Guests: 2 adults</Badge>
          <Badge variant="outline">Channel: WhatsApp</Badge>
        </div>

        <div className="space-y-3 bg-[linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:24px_24px] p-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[85%] rounded-[1.35rem] px-4 py-3 text-sm leading-6 shadow-sm",
                message.sender === "assistant"
                  ? "bg-white text-slate-900"
                  : "ml-auto bg-[#d8fdd2] text-slate-900",
              )}
            >
              <p>{message.body}</p>
              <p className="mt-1 text-right text-xs text-slate-400">{message.time}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4 px-5 pb-5">
          <div>
            <p className="mb-3 text-sm font-medium text-slate-700">Show a demo moment</p>
            <div className="flex flex-wrap gap-2">
              {simulationReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => {
                    setSelectedReply(reply);
                    onScenarioChange(reply);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition",
                    reply === selectedReply
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-white text-slate-700 hover:border-primary/40",
                  )}
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-full border bg-white px-4 py-3">
            <p className="flex-1 text-sm text-slate-400">Type a guest message...</p>
            <Send className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
