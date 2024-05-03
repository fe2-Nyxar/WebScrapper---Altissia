export async function SelectingTheQuestionIfBtn(page, AudioTextwhis) {
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

  // ! getting the questions
  await exerciseContainer.waitForSelector(
    "altissia-exercise-question p.exercise-question"
  );
  const questionBox = await exerciseContainer.$(
    "altissia-exercise-question p.exercise-question"
  );

  const { QuestionLayer2, length } = await questionBox.evaluate(
    (questionBox) => {
      const questionTextElements = questionBox.querySelectorAll(
        ".question-text, .btn"
      );
      const output = [];
      questionTextElements.forEach((element) => {
        if (element.tagName === "BUTTON") {
          output.push("<insérer la réponse>");
        } else {
          output.push(element.textContent.trim());
        }
      });
      return { QuestionLayer2: output.join(" "), length };
    },
    questionBox
  );

  // ? waiting for  the answer's button

  const exerciseSuggestions = await exerciseContainer.$$(
    "ul.multiple-choice-buttons-list li button.btn.multiple-choice-btn"
  );

  // ! selecting the suggestions
  let suggestionsArray = [];
  if (exerciseSuggestions.length !== 0) {
    suggestionsArray = await Promise.all(
      exerciseSuggestions.map(async (button, i) => {
        const buttonText = await page.evaluate(
          (element, i) => {
            element.id = `btnAnswer${i}`;
            return element.textContent.trim();
          },
          button,
          i
        );
        return { [`btnAnswer${i}`]: buttonText };
      })
    );
  }
  // let Question = `Sélectionnez la bonne réponse basée uniquement sur cet objet JSON exemple: { btnAnswer0: suggestion0, btnAnswer1: ...}, choisissez la clé pour sélectionner la valeur correcte.
  // Votre réponse doit uniquement consister en la clé et doit être renvoyée sous forme d'un tableau JavaScript des clés correctes exemple : ["btnAnswer5" , "btnAnswer9"... ], si Il'ya un seule reponse, le tableau doint en form: ["buttonAnswer2"]
  // \nQuestion: ${QuestionLayer1}
  // \nSentence: ${QuestionLayer2}
  // \nSuggestions:${suggestionsArray
  //   .map((obj) => JSON.stringify(obj))
  //   .join(", ")}`;

  let Question = `Sélectionnez la bonne réponse basée uniquement sur cet objet JSON exemple: { btnAnswer0: suggestion0, btnAnswer1: ...}, choisissez la clé pour sélectionner la valeur correcte.
Votre réponse doit uniquement consister en la clé et doit être renvoyée sous forme d'un tableau JavaScript only javascript array des clés correctes exemple : ["btnAnswer5","btnAnswer9"... ], si Il'ya un seule reponse, le tableau doint en form: ["buttonAnswer2"]
\nQuestion: ${QuestionLayer1}
\n ${AudioTextwhis !== null ? "paragraph:" + AudioTextwhis : ""}
\nSentence: ${QuestionLayer2}
\n ${
    suggestionsArray.length > 0
      ? "Suggestions:" +
        suggestionsArray.map((obj) => JSON.stringify(obj)).join(", ")
      : ""
  }`;

  return { Question, imageHref };
}

export async function SelectTheAnswer(answers, page) {
  for (let answer of answers) {
    await page.click(`#${answer}`);
  }
}
