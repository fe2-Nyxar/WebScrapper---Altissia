import { config } from "dotenv";
import { inspect } from "util";
import puppeteer from "puppeteer";
import { login } from "./Methods/Login.mjs";
import { nextLesson } from "./Methods/nextLesson.mjs";
import { nextActivity } from "./Methods/nextActivity.mjs";
import { completeExercise } from "./Methods/ExercisesLogic.mjs/Exercises.mjs";
import { OpenAI } from "openai";
import { isItDone } from "./Methods/isItDone.mjs";
import { pageLogic } from "./Methods/PageLogic.mjs";

config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const username = process.env.usrname;
const password = process.env.pass;

const browser = await puppeteer.launch({
  headless: false,
});

const page = await browser.newPage();

await page.goto(
  "https://app.ofppt-langues.ma/gw/api/saml/init?idp=https://sts.windows.net/dae54ad7-43df-47b7-ae86-4ac13ae567af/"
);

await page.waitForNavigation({ waitUntil: "networkidle2" });
await login(page, username, password);
await page.waitForNavigation({ waitUntil: "networkidle0" });
await pageLogic(
  page,
  nextLesson,
  nextActivity,
  isItDone,
  completeExercise,
  openai,
  inspect
);
