import fs from "fs"
import timeDate from "./cal_time.js"

export default function nodeLogger(filename, filetext){

const dato = timeDate().split(" ", 1)

    return(
        fs.appendFile(`log/${dato}-${filename}.txt`, `${filetext} \n`, function (err) {
            if (err) throw err
          })
    )
}