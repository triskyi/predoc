import { NextResponse } from "next/server";


export async function GET() {
  // Example: count predictions per month for each disease
  // Replace with real aggregation if you have timestamps
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const result: { month: string; Diabetes: number; Hypertension: number }[] = [];

  for (let i = 0; i < months.length; i++) {
    result.push({
      month: months[i],
      Diabetes: Math.floor(Math.random() * 50 + 10),
      Hypertension: Math.floor(Math.random() * 40 + 5),
    });
  }

  return NextResponse.json(result);
}
