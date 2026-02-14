import { NextRequest, NextResponse } from "next/server";
import { searchPapers, getJournalList } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const journal = searchParams.get("journal") || "";
    const yearFrom = parseInt(searchParams.get("yearFrom") || "0");
    const yearTo = parseInt(searchParams.get("yearTo") || "0");
    const limit = Math.min(parseInt(searchParams.get("limit") || "25"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    const result = searchPapers(query, journal, yearFrom, yearTo, limit, offset);
    const journals = getJournalList();

    return NextResponse.json({ ...result, journals });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search papers", details: String(error) },
      { status: 500 }
    );
  }
}
