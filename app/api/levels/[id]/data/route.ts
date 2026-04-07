import { downloadLevel } from "@/app/services";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const level = await downloadLevel(parseInt(id, 10))
  
  if (!level || !level.id){
    return new NextResponse(null, {status: 404})
  }
  return new NextResponse(level.data)
}
