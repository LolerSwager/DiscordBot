import nodeConsole from "./nodeConsole.js";

export default function nodeExit(){

  process.on("SIGINT", async () => {
    await nodeConsole('ok','manual stopped',`Process ${process.pid} has been interrupted`);
    process.exit(0);
    
  });

  process.on("uncaughtException", async (err) => {
    await nodeConsole('error', 'error', `Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
} 