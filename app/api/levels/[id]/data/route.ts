import { downloadLevel } from "@/app/services";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params
  const level = await downloadLevel(id)
  
  if (!level || !level.id){
    return new NextResponse(null, {status: 404})
  }
  return new NextResponse(level.data)
}