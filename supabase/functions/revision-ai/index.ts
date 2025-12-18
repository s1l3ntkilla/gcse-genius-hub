import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, subject, topic, specificationContext, messages, count } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    const specContext = specificationContext 
      ? `\n\nGCSE Specification Context:\n${specificationContext}` 
      : "";

    if (action === "generate-flashcards") {
      systemPrompt = `You are a GCSE exam tutor specializing in ${subject}. Generate educational flashcards for students.${specContext}
      
Return ONLY valid JSON array with no markdown formatting. Each flashcard should have:
- question: A clear question testing key knowledge
- answer: A concise, accurate answer
- difficulty: "easy", "medium", or "hard"
- topic: The specific topic area`;

      userPrompt = `Generate ${count || 5} flashcards for GCSE ${subject}${topic ? ` on the topic: ${topic}` : ''}. Return as JSON array.`;
    } 
    else if (action === "generate-questions") {
      systemPrompt = `You are a GCSE exam tutor specializing in ${subject}. Generate multiple choice practice questions.${specContext}
      
Return ONLY valid JSON array with no markdown formatting. Each question should have:
- question: The question text
- options: Array of 4 possible answers
- correctAnswer: The correct option (must match one of the options exactly)
- explanation: Brief explanation of why the answer is correct
- difficulty: "easy", "medium", or "hard"
- marks: 1-4 based on difficulty
- topic: The specific topic area`;

      userPrompt = `Generate ${count || 3} multiple choice questions for GCSE ${subject}${topic ? ` on the topic: ${topic}` : ''}. Return as JSON array.`;
    }
    else if (action === "chat") {
      systemPrompt = `You are a helpful GCSE tutor specializing in ${subject}. Help students understand concepts, explain topics clearly, and guide them through problems step-by-step. Be encouraging and educational.${specContext}
      
Important: Show your working and explain your reasoning. Don't just give answers - help students understand.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error(`AI gateway error: ${response.status}`);
      }

      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }
    else {
      throw new Error("Invalid action");
    }

    // Non-streaming response for flashcards and questions
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the AI response
    try {
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const parsed = JSON.parse(cleanedContent);
      return new Response(JSON.stringify({ data: parsed }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("revision-ai error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
