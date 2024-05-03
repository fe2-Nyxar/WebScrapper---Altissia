import fs from "fs";
async function getTheAudio(page) {
  await page.waitForSelector("div.plyr__progress");
  page.on("response", async (response) => {
    const url = response.url();
    const extension = url.split(".").pop();
    const contentType = response.headers()["content-type"];
    if (extension === "blu" && contentType === "audio/mpeg") {
      try {
        let audioBlu = await response.buffer();
        fs.writeFileSync("./AudioJunk/audiogen.mp3", audioBlu);
      } catch (error) {
        console.error("the error is: ", error);
        return false;
      }
    }
  });
}

export async function AudioToText(page, openai) {
  let audio = await getTheAudio(page);
  if (audio === undefined) {
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream("./AudioJunk/audiogen.mp3"),
        model: "whisper-1",
        response_format: "verbose_json",
      });
      console.log(`whisper speech to text: ${transcription.text}`);
      return transcription.text;
    } catch (err) {
      return null;
    }
  }
}
