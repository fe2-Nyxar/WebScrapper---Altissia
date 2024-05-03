import {
  TypeTheAnswer,
  SelectingTheQuestionIfInput,
} from "./TypeOfExercise/ExerciseIsInp.mjs";
import {
  SelectTheAnswer,
  SelectingTheQuestionIfBtn,
} from "./TypeOfExercise/ExerciseIsBtn.mjs";
import {
  SelectTheAnswerArrange,
  SelectingTheArrangeSentence,
} from "./TypeOfExercise/ExerciseArrange.mjs";
import { OpenAiComplete } from "./OpenAiCompletion.mjs";
import { AudioToText } from "./AudioToText.mjs";

export async function completeExercise(page, openai, inspect) {
  const {
    questionFieldBtn,
    questionFieldInput,
    AudioFieldInput,
    questionFieldArrange,
  } = await waitForContentToLoad(page);

  let AudioTextwhisper = null;
  if (AudioFieldInput) {
    AudioTextwhisper = await AudioToText(page, openai);
  }
  if (questionFieldBtn) {
    const { Question, imageHref } = await SelectingTheQuestionIfBtn(
      page,
      AudioTextwhisper
    );
    const answers = await OpenAiComplete(openai, Question, imageHref, inspect);

    await SelectTheAnswer(answers, page);
  } else if (questionFieldInput) {
    const { Question, length, imageHref } = await SelectingTheQuestionIfInput(
      page,
      AudioTextwhisper
    );

    const answers = await OpenAiComplete(openai, Question, imageHref, inspect);

    await TypeTheAnswer(page, length, answers);
  } else if (questionFieldArrange) {
    const { Question, imageHref } = await SelectingTheArrangeSentence(
      page,
      AudioTextwhisper
    );
    
    const answers = await OpenAiComplete(openai, Question, imageHref, inspect);
    // await SelectTheAnswerArrange(answers, page);
  }

  await validateExercise(page);
}

async function validateExercise(page) {
  await page.waitForSelector(
    "altissia-footer-button-bar div.footer-button-bar-container.footer-button-bar-container-is-fixed div.footer-button-bar-row button.btn.footer-button-bar-btn"
  );

  const validateExerciseBtn = await page.$(
    "altissia-footer-button-bar div.footer-button-bar-container.footer-button-bar-container-is-fixed div.footer-button-bar-row button.btn.footer-button-bar-btn"
  );

  await validateExerciseBtn.click();
  await validateExerciseBtn.click();
}

async function waitForContentToLoad(page) {
  await page.waitForSelector("section.exercise-container");
  const exerciseContainer = await page.$("section.exercise-container");
  const AudioFieldInput =
    (await exerciseContainer.$("div.plyr__controls div.plyr__progress")) ===
    null
      ? false
      : true;
  const questionFieldArrange =
    (await exerciseContainer.$("div.drop-zone.highlighted-box")) === null
      ? false
      : true;

  const questionFieldBtn =
    (await exerciseContainer.$(
      "altissia-multiple-choice-player ul.multiple-choice-buttons-list"
    )) === null
      ? false
      : true;
  const questionFieldInput =
    (await exerciseContainer.$(
      "altissia-exercise-question p.exercise-question input.question-input"
    )) === null
      ? false
      : true;
  return {
    questionFieldBtn,
    questionFieldInput,
    AudioFieldInput,
    questionFieldArrange,
  };
}
// function answerID(num) {
//   let letters = "";
//   while (num >= 0) {
//     letters = String.fromCharCode((num % 26) + 65) + letters;
//     num = Math.floor(num / 26) - 1;
//   }

//   return letters;
// }
