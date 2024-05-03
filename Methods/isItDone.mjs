export async function isItDone(page, openai, completeExercise, inspect) {
  let exerciceResult;
  let i = 0;
  let shouldContinue = false;
  do {
    await page.waitForSelector("div.progress-container p.progress-bar-numbers");
    const progressNumber = await page.evaluate(
      (element) =>
        parseInt(element.innerText.match(/(?<=\/)\s*\d+/g)[0].trim()),
      await page.$("div.progress-container p.progress-bar-numbers")
    );
    for (let exec = 0; exec < progressNumber; exec++) {
      await completeExercise(page, openai, inspect);
    }
    await page.waitForSelector(
      "div.new-container p.user-result-box span.result-title"
    );
    exerciceResult = await page.evaluate(
      (element) => parseInt(element.innerText.match(/\d+/g)[0].trim()),
      await page.$("div.new-container p.user-result-box span.result-title")
    );
    if (i < 2 && exerciceResult < 71) {
      const retryButton = "altissia-main-button button.btn-primary-ghost";
      await page.waitForSelector(retryButton);
      await page.click(retryButton);
      shouldContinue = true;
      i++;
    } else {
      shouldContinue = false;
    }
  } while (shouldContinue);
  const successButton = "altissia-main-button button.false";
  await page.waitForSelector(successButton);
  await page.click(successButton);
}
