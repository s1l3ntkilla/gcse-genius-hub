import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.88.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type JoinClassroomResponse =
  | {
      success: true;
      already_member: boolean;
      status: string;
      classroom: { id: string; name: string; subject: string };
    }
  | { success: false; error: string };

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      console.error("join-classroom: missing env", {
        hasUrl: !!supabaseUrl,
        hasAnon: !!anonKey,
        hasServiceRole: !!serviceRoleKey,
      });
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" } satisfies JoinClassroomResponse),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      console.warn("join-classroom: unauthorized", { userErr });
      return new Response(
        JSON.stringify({ success: false, error: "Not authenticated" } satisfies JoinClassroomResponse),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawCode = typeof body?.code === "string" ? body.code : "";
    const code = rawCode.trim().toUpperCase();

    if (!/^[A-Z0-9]{6}$/.test(code)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid class code" } satisfies JoinClassroomResponse),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: classroom, error: classroomErr } = await adminClient
      .from("classrooms")
      .select("id, name, subject")
      .eq("class_code", code)
      .maybeSingle();

    if (classroomErr) {
      console.error("join-classroom: classroom lookup error", classroomErr);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to look up classroom" } satisfies JoinClassroomResponse),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!classroom) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid class code. Please check and try again." } satisfies JoinClassroomResponse),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userId = userData.user.id;

    const { data: existingMember, error: existingErr } = await adminClient
      .from("classroom_members")
      .select("id, status")
      .eq("classroom_id", classroom.id)
      .eq("student_id", userId)
      .maybeSingle();

    if (existingErr) {
      console.error("join-classroom: membership lookup error", existingErr);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to verify membership" } satisfies JoinClassroomResponse),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (existingMember) {
      return new Response(
        JSON.stringify({
          success: true,
          already_member: true,
          status: existingMember.status,
          classroom,
        } satisfies JoinClassroomResponse),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: inserted, error: insertErr } = await adminClient
      .from("classroom_members")
      .insert({
        classroom_id: classroom.id,
        student_id: userId,
        status: "accepted",
        joined_at: new Date().toISOString(),
      })
      .select("id, status")
      .single();

    if (insertErr) {
      console.error("join-classroom: insert error", insertErr);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to join the class. Please try again." } satisfies JoinClassroomResponse),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        already_member: false,
        status: inserted.status,
        classroom,
      } satisfies JoinClassroomResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("join-classroom: unexpected error", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" } satisfies JoinClassroomResponse),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
