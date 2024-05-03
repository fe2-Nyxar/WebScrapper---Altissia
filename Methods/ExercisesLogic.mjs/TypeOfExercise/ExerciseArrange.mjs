export async function SelectingTheArrangeSentence(page, AudioTextwhis) {
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

  // ? waiting for  the answer's button

  const ArrangeSuggestionBtns = await exerciseContainer.$$(
    "div.drag-and-drop-buttons-list button"
  );
  // ! selecting the suggestions
  let suggestionsArray = [];
  if (ArrangeSuggestionBtns.length > 0) {
    suggestionsArray = await Promise.all(
      ArrangeSuggestionBtns.map(async (button, i) => {
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

  let Question = `Re-arrange this french sentence into the correct order, your answer should be in a javascript array only, and inside the array you gonna use the keys to acces the values example ["btnAnswer6","btnAnswer2", "btnAnswer0",...] this means // "Aujourd'hui, nous sommes le 2 avril 2025." :
  \nQuestion: ${QuestionLayer1}
  \n${AudioTextwhis !== null ? "paragraph:" + AudioTextwhis : ""}
  \n ${
    suggestionsArray.length > 0
      ? "Suggestions:" +
        suggestionsArray.map((obj) => JSON.stringify(obj)).join(", ")
      : ""
  }`;
  return { Question, imageHref };
}

export async function SelectTheAnswerArrange(answers, page) {
  for (let answer of answers) {
    await page.click(`#${answer}`);
  }
}
