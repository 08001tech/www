// Auth routes disabled - all requests will return 404
import { NextResponse } from "next/server";

export const GET = () => NextResponse.json({ error: "Not found" }, { status: 404 });

export const POST = () => NextResponse.json({ error: "Not found" }, { status: 404 });

export const PUT = () => NextResponse.json({ error: "Not found" }, { status: 404 });

export const DELETE = () => NextResponse.json({ error: "Not found" }, { status: 404 });

export const PATCH = () => NextResponse.json({ error: "Not found" }, { status: 404 });
