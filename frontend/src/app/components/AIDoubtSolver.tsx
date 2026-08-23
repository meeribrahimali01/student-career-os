import React, { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Code2,
  Lightbulb,
  Zap,
  Copy,
  Check,
} from "lucide-react";
import { GlassSurface, GlassButton, GlassBadge } from "./ui/LiquidGlass";

interface AIDoubtSolverProps {
  initialPrompt?: string;
  onNavigateToCampus?: (locId: string) => void;
}

interface ChatMessage {
  id: number;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  contextTag?: string;
  mode?: string;
}

const LEARNING_CONTEXTS = [
  { id: "graphs", label: "Graph Algorithms & Dijkstra" },
  { id: "dp", label: "Dynamic Programming & Knapsack" },
  { id: "os", label: "Operating Systems (Virtual Memory & Deadlocks)" },
  { id: "dbms", label: "DBMS (B+ Trees & ACID Transactions)" },
  { id: "system_design", label: "System Design (Caching, Redis, CAP)" },
  { id: "general_cs", label: "General Computer Science & Placement Prep" },
];

const EXPLANATION_MODES = [
  { id: "simple", label: "💡 Explain Simply", icon: Lightbulb, desc: "Intuitive, beginner-friendly clarity" },
  { id: "deep", label: "🔬 Deep Dive", icon: Zap, desc: "Under-the-hood mechanics & invariants" },
  { id: "analogy", label: "🧩 Analogy", icon: Sparkles, desc: "Real-world physical metaphor" },
  { id: "step_by_step", label: "📝 Step-by-Step Code", icon: Code2, desc: "Algorithmic walk-through" },
  { id: "quiz", label: "🧪 Quiz Me", icon: HelpCircle, desc: "Practice challenge question" },
];

const PROMPT_SUGGESTIONS = [
  "Why does Dijkstra's algorithm fail when graph edges have negative weights?",
  "Explain B+ Tree indexing vs Hash Indexing for database range queries",
  "What is the difference between Write-Through and Write-Back caching?",
  "Explain Process Virtual Memory and why Thrashing happens",
  "How does Kahn's algorithm detect cycles in Directed Graphs?",
];

export default function AIDoubtSolver({ initialPrompt }: AIDoubtSolverProps) {
  const [selectedContext, setSelectedContext] = useState<string>("graphs");
  const [selectedMode, setSelectedMode] = useState<string>("simple");
  const [inputQuery, setInputQuery] = useState<string>(initialPrompt || "");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hello Aryan! I am your Meridian AI Engineering Tutor. Select a learning context and explanation mode (Simple, Deep Dive, Analogy, Code, or Quiz) to explore any computer science, algorithm, or campus concept.",
      timestamp: "10:30 AM",
      contextTag: "General CS",
    },
  ]);

  const handleSend = (text?: string) => {
    const query = text || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      contextTag: LEARNING_CONTEXTS.find((c) => c.id === selectedContext)?.label,
      mode: EXPLANATION_MODES.find((m) => m.id === selectedMode)?.label,
    };

    let aiResponse = "";
    const lower = query.toLowerCase();

    if (lower.includes("library") || lower.includes("ab1") || lower.includes("ab-1") || lower.includes("ab2") || lower.includes("ab3") || lower.includes("health centre") || lower.includes("hostel")) {
      aiResponse = `📍 **Campus Location Guidance:**\n\nYou asked about a VIT Chennai campus facility. Use the **Campus Navigator** in the sidebar to view the interactive 2D map, turn-by-turn walking routes, and floor directories.`;
    } else if (lower.includes("dijkstra") && lower.includes("negative")) {
      if (selectedMode === "analogy") {
        aiResponse =
          "🧩 **Analogy for Dijkstra with Negative Edges:**\n\nImagine driving a car on a road trip finding the shortest toll route. Dijkstra greedily marks a city 'Visited & Finalized' assuming driving further always costs positive fuel.\n\nIf suddenly a negative toll booth gives cashback down a hidden alley, your previously 'finalized' shortest path was incomplete! That is why Bellman-Ford or Johnson's Algorithm is required for negative edge graphs.";
      } else if (selectedMode === "deep") {
        aiResponse =
          "🔬 **Deep Invariant Breakdown:**\n\n• **Dijkstra's Invariant:** For every vertex u removed from the Min-Priority Queue, `dist[u] = δ(s, u)` (absolute shortest distance from source s).\n• **Why it breaks:** If a negative edge (u, v) exists downstream, traversing through another node could yield a path shorter than `dist[v]`, which was already popped.\n• **Complexity:** Dijkstra runs in `O((V + E) log V)`, whereas Bellman-Ford handles negative weights in `O(V * E)`.";
      } else {
        aiResponse =
          "💡 **Simple Explanation:**\n\nDijkstra's algorithm is 'greedy' — once it identifies what looks like the shortest path to a node, it assumes that distance can NEVER get smaller.\n\nNegative weights break this assumption because a detour down a negative edge could make an already finalized path even shorter. For graphs with negative edges, use the **Bellman-Ford algorithm** instead!";
      }
    } else if (lower.includes("b+ tree") || lower.includes("b+tree") || lower.includes("index")) {
      aiResponse =
        "💡 **B+ Trees in Database Storage:**\n\n1. **High Fan-out:** Nodes have hundreds of child pointers matching disk page sizes (4KB/8KB).\n2. **Leaves Linked in Linked List:** Enables fast range scans (e.g. `WHERE age BETWEEN 20 AND 30`) without re-traversing the root.\n3. **Balanced Depth:** Guarantees O(log_B N) search in 3-4 disk seek operations.";
    } else {
      aiResponse = `Here is a structured breakdown for **${query}** [Mode: ${selectedMode}]:\n\n1. **Core Concept:** In systems engineering and technical interviews, articulate the algorithmic invariant and state space.\n2. **Time & Space Trade-offs:** Always state the Big-O asymptotic bounds.\n3. **Practical Production Use Case:** Discuss how this is applied in modern distributed cloud architectures (e.g. Redis, Kafka, PostgreSQL).`;
    }

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: Date.now() + 1,
        sender: "ai",
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        contextTag: userMsg.contextTag,
      },
    ]);
    setInputQuery("");
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <GlassSurface level={2} className="h-[calc(100vh-160px)] flex flex-col overflow-hidden shadow-xs">
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 1. TOP CONTEXT & EXPLANATION MODE SELECTOR BAR                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="p-3.5 border-b border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] bg-[#FAF8F5] dark:bg-[#17241D] space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1C2E24] dark:bg-[#203429] text-[#FBFBF9] flex items-center justify-center shadow-xs">
              <Bot size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#1C2E24] dark:text-[#F4F7F5]">AI Engineering Tutor</h2>
                <GlassBadge label="Gemini 3.6" variant="accent" />
              </div>
              <p className="text-[10px] text-[#556B5F] dark:text-[#95AFA1]">Interactive concept deconstructions, code walkthroughs & analogies</p>
            </div>
          </div>

          {/* Learning Context Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#556B5F] dark:text-[#95AFA1] whitespace-nowrap">Context:</span>
            <select
              value={selectedContext}
              onChange={(e) => setSelectedContext(e.target.value)}
              className="bg-[#F2EFE9] dark:bg-[#1D2D24] border border-[rgba(28,46,36,0.1)] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1C2E24] dark:text-[#F4F7F5] outline-none focus:border-[#4E7D63]"
            >
              {LEARNING_CONTEXTS.map((ctx) => (
                <option key={ctx.id} value={ctx.id} className="bg-[#FAF8F5] text-[#1C2E24]">
                  {ctx.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Explanation Mode Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scroll pt-0.5">
          {EXPLANATION_MODES.map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#1C2E24] dark:bg-[#4E7D63] text-[#FBFBF9] shadow-2xs"
                    : "bg-[#F2EFE9] dark:bg-[#17241D] hover:bg-[#EAE6DE] text-[#556B5F] hover:text-[#1C2E24] border border-[rgba(28,46,36,0.08)]"
                }`}
                title={mode.desc}
              >
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 2. CHAT MESSAGE STREAM                                         */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 no-scroll bg-[#FBFBF9] dark:bg-[#0F1A14]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-2xl rounded-2xl p-3.5 text-xs leading-relaxed space-y-1.5 ${
                msg.sender === "user"
                  ? "bg-[#1C2E24] text-[#FBFBF9] rounded-tr-none shadow-2xs border border-[#1C2E24]/20"
                  : "bg-[#F2EFE9] dark:bg-[#17241D] text-[#1C2E24] dark:text-[#F4F7F5] rounded-tl-none border border-[rgba(28,46,36,0.08)] shadow-2xs"
              }`}
            >
              {msg.contextTag && (
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full inline-block ${
                    msg.sender === "user" ? "bg-[#FAF8F5]/20 text-[#FBFBF9]" : "bg-[#EDF4F0] text-[#3B624E] border border-[rgba(78,125,99,0.3)]"
                  }`}
                >
                  {msg.contextTag}
                </span>
              )}

              <p className="whitespace-pre-line text-xs">{msg.text}</p>

              <div className="flex items-center justify-between pt-1 border-t border-[rgba(28,46,36,0.08)] opacity-80 text-[10px]">
                <span>{msg.timestamp}</span>
                {msg.sender === "ai" && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="hover:opacity-100 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === msg.id ? <Check size={11} className="text-[#4E7D63]" /> : <Copy size={11} />}
                    <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 3. PROMPT CHIPS & INPUT BOX                                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="p-3.5 border-t border-[rgba(28,46,36,0.08)] bg-[#FAF8F5] dark:bg-[#17241D] space-y-2.5">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scroll">
          <span className="text-[10px] font-bold text-[#556B5F] flex items-center gap-1 flex-shrink-0">
            <Sparkles size={11} className="text-[#4E7D63]" /> Suggestions:
          </span>
          {PROMPT_SUGGESTIONS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[10px] bg-[#F2EFE9] dark:bg-[#1D2D24] hover:bg-[#EAE6DE] text-[#556B5F] hover:text-[#1C2E24] px-2 py-0.5 rounded-lg border border-[rgba(28,46,36,0.08)] transition-colors cursor-pointer whitespace-nowrap"
            >
              {p.length > 42 ? `${p.slice(0, 42)}...` : p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Ask any doubt in ${LEARNING_CONTEXTS.find((c) => c.id === selectedContext)?.label}...`}
            className="flex-1 bg-[#FBFBF9] dark:bg-[#0F1A14] border border-[rgba(28,46,36,0.1)] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#4E7D63] text-[#1C2E24] dark:text-[#F4F7F5] placeholder:text-[#7C9184]"
          />
          <GlassButton
            variant="primary"
            size="md"
            onClick={() => handleSend()}
          >
            <Send size={13} />
            <span>Send</span>
          </GlassButton>
        </div>
      </div>
    </GlassSurface>
  );
}
