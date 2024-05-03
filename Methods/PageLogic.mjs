export async function pageLogic(
  page,
  nextLesson,
  nextActivity,
  isItDone,
  completeExercise,
  openai,
  inspect
) {
  let numbersOfLessons = 0;
  let i = 0;

  do {
    let numbersOfActivities;
    numbersOfLessons = await nextLesson(page, inspect);
    do {
      numbersOfActivities = await nextActivity(page, inspect);
      await isItDone(page, openai, completeExercise, inspect);
    } while (numbersOfActivities > 0);

    if (numbersOfActivities === 0 && numbersOfLessons > 0) {
      const AccueilBtnSelector =
        "div.new-container ol.breadcrumb-list li.breadcrumb-list-item a.breadcrumb-link";

      await page.waitForSelector(AccueilBtnSelector);
      const aTagHref = await page.evaluate((AccueilBtnSelector) => {
        const element = document.querySelector(AccueilBtnSelector);
        if (element !== null) {
          return element.href;
        }
      }, AccueilBtnSelector);
      await page.goto(aTagHref, { waitUntil: "networkidle0" });
    }
    i++;
  } while (numbersOfLessons > 0);
}
