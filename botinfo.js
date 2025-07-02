export default function getBotInfo() {
  const savedBotInfo = localStorage.getItem("botinfo");
  if (savedBotInfo) {
    try {
      const botInfo = JSON.parse(savedBotInfo);
      return Array.isArray(botInfo) ? botInfo : [botInfo];
    } catch (error) {
      console.error("Error parsing botinfo:", error);
      return [];
    }
  }
}
