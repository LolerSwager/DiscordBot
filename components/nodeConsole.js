import timeDate from "./cal_time.js"
import nodeLogger from "./nodeLogger.js"
import fs from "fs"

export default function nodeConsole(consoleColor, subject, text1){

  nodeLogger('ConsoleLog', `[${timeDate()}] [${subject.toUpperCase()}] - ${text1}`);

    switch(consoleColor) {
        case "ok":
            consoleColor = "\x1b[32m"
          break;
        case "err":
            consoleColor = "\x1b[31m"
          break;
          case "error":
            consoleColor = "\x1b[31m"
          break;
        case "info":
            consoleColor = "\x1b[36m"
          break;
          case "warn":
            consoleColor = "\x1b[33m"
          break;
          case "warning":
            consoleColor = "\x1b[33m"
          break;
        default:
            consoleColor = "\x1b[38m"
      }
    return(console.log(`${consoleColor}[${timeDate()}] [${subject.toUpperCase()}] - ${text1} \x1b[0m`))
}