export async function SelectingTheQuestionIfInput(page, AudioTextwhis) {
  const exerciseContainer = await page.$("section.exercise-container");

  const exerciseInstructionBox = await exerciseContainer.$(
    "div.exercise-instruction-box"
  );

  const QuestionLayer1 = await exerciseInstructionBox.evaluate(
    (element) => element.innerText
  );

  //? in case an image exist
  const imageHref = await exerciseContainer.evaluate(() => {
    const img = document.querySelector("img.exercise-img");
    return img !== null ? img.src : "no Image";
  });
  // console.log(imageHref);

  //! getting the questions
  await exerciseContainer.waitForSelector(
    "altissia-exercise-question p.exercise-question"
  );
  const questionBox = await exerciseContainer.$(
    "altissia-exercise-question p.exercise-question"
  );

  const { QuestionLayer2, length } = await questionBox.evaluate(() => {
    const questionTextElements = document.querySelectorAll(
      ".question-text, .input"
    );
    let length = 0;
    const output = [];
    questionTextElements.forEach((element) => {
      if (element.tagName === "INPUT") {
        element.id = `inputField${length}`;
        output.push("<insérer la réponse>");
        length++;
      } else {
        output.push(element.textContent.trim());
      }
    });

    return { QuestionLayer2: output.join(" "), length };
  });
  let Question = `Changer les <insérer la réponse> par le mot correct, sans fournir d'informations ou d'explications supplémentaires, la réponse doit être sous forme de array javascript only javascript array [réponse1, réponse2 ,...].
\nQuestion: ${QuestionLayer1}
\n ${AudioTextwhis !== null ? "paragraph:" + AudioTextwhis : ""}
\nSentence:${QuestionLayer2}`;

  //todo: add a help field in case it exist
  return { Question, length, imageHref };
}

export async function TypeTheAnswer(page, length, answers) {
  for (let i = 0; i < length; i++) {
    await page.type(`#inputField${i}`, answers[i]);
  }
}
