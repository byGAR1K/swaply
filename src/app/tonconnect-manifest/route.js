// src/app/api/tonconnect-manifest/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // request.url содержит полный URL запроса -> new URL(...).origin даст протокол+хост
    const origin = new URL(request.url).origin;

    const manifest = {
      url: origin,
      name: "Swaply",
      // иконка — мы предполагаем, что положил logo.png в public/
      iconUrl: `${origin}/logo.png`,
      // другие поля по желанию:
      description: "Swaply — Telegram gifts & TON",
    };

    return NextResponse.json(manifest, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}