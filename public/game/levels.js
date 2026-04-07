function unpackLevelResponse(data) {
  const [levelPart, creatorPart] = data.split("#");
  const levelObjects = levelPart.split("|");
  const levelObject = levelObjects[0];
  const creators = creatorPart.split("#");
  const creator = unpackLevelCreator(creators[0]);
  const tokens = levelObject.split(":");
  const rawLevel = {};
  for (let i = 0; i < tokens.length; i += 2) {
    const key = tokens[i];
    const value = tokens[i + 1] ?? "";
    rawLevel[key] = value;
  }
  const level = {
    id: Number(rawLevel["1"]),
    name: rawLevel["2"],
    description: safeDecodeBase64(rawLevel["3"]),
    data: rawLevel["4"],
    author_gd_id: creator.accountId,
    author_name: creator.username,
    downloads: Number(rawLevel["10"]),
    version: rawLevel["5"],
    likes: Number(rawLevel["14"]),
    stars: Number(rawLevel["18"]),
    demonDifficulty: Number(rawLevel["43"]),
    demon: Boolean(rawLevel["17"]),
  };
  console.log(level);
  return level;
}
export async function downloadLevel(id) {
  const formData = new FormData();
  formData.append("secret", "Wmfd2893gb7");
  formData.append("levelID", String(id));

  const r = await fetch(
    "http://www.boomlings.com/database/downloadGJLevel22.php",
    {
      method: "POST",
      body: formData,
      headers: { "User-Agent": "" },
    },
  );
  const data = await r.text();
  const level = unpackLevelResponse(data);
  return level;
}
