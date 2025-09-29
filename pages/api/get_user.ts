import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const response = await fetch(`https://t.me/${username}`);
    const text = await response.text();

    // Парсим display name
    const nameMatch = text.match(/<title>(.*?)<\/title>/);
    const name = nameMatch ? nameMatch[1].replace("Telegram: ", "").trim() : username;

    // Парсим аватар
    const avatarMatch = text.match(/<meta property="og:image" content="(.*?)"/);
    const avatar = avatarMatch ? avatarMatch[1] : null;

    // Парсим span с ником
    const usernameMatch = text.match(/<span dir="auto">(.*?)<\/span>/);
    const parsedUsername = usernameMatch ? usernameMatch[1].trim() : username;

    res.status(200).json({
      name,
      username: parsedUsername, // вот тут подставляем GAR1KK
      avatar,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}