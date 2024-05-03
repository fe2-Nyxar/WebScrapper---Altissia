async function currentStateOfMissions(page, inspect) {
  const ActivitiesSelec = await page.waitForSelector(
    "ul.lesson-menu-activities-list li"
  );
  await ActivitiesSelec.waitForSelector(
    "altissia-activity-overview-card a.new-card"
  );
  await ActivitiesSelec.waitForSelector(
    "altissia-activity-overview-card a.new-card div.activity-overview-content div.activity-overview-details p.activity-name"
  );
  const AllActivities = page.evaluate(() => {
    const Activities = document.querySelectorAll(
      "ul.lesson-menu-activities-list li"
    );
    let exercicesList = [];
    let videoList = [];
    let PrononciationList = [];
    let RandomList = [];
    let TestList = [];
    let GrammarList = [];
    let actualTest = [];
    Activities.forEach((activity) => {
      const activityTitle = activity.querySelector(
        "altissia-activity-overview-card a.new-card div.activity-overview-content div.activity-overview-details p.activity-name"
      );
      const completedActivities = activity.querySelector(
        "altissia-activity-overview-card a.new-card div.activity-overview-content fa-icon.ng-fa-icon.activity-type-icon.activity-type-icon-success"
      );
      const aTagActivity = activity.querySelector(
        "altissia-activity-overview-card a.new-card"
      );
      actualTest.push(activityTitle.textContent.trim());
      let activityType = activityTitle.textContent.trim();
      if (completedActivities === null) {
        switch (activityType) {
          case "Exercice":
            exercicesList.push([activityType, aTagActivity.href]);
            break;
          case "Video":
            videoList.push([activityType, aTagActivity.href]);
            break;
          case "Prononciation":
            PrononciationList.push([activityType, aTagActivity.href]);
            break;
          case "Règle de grammaire":
            GrammarList.push([activityType, aTagActivity.href]);
            break;
          case "Test récapitulatif":
            TestList.push([activityType, aTagActivity.href]);
            break;
          default:
            RandomList.push([activityType, aTagActivity.href]);
            break;
        }
      }
    });

    return {
      exercicesList,
      videoList,
      PrononciationList,
      RandomList,
      TestList,
      GrammarList,
    };
  });
  return AllActivities;
}

export async function nextActivity(page, inspect) {
  const { exercicesList } = await currentStateOfMissions(page, inspect);
  exercicesList.reverse().forEach(async (firstLayer) => {
    await page.goto(`${firstLayer[1]}`, { waitUntil: "networkidle0" });
  });
  return exercicesList.length - 1;
}

// export async function nextActivity(page, inspect) {
//   const { exercicesList } = await currentStateOfMissions(page, inspect);
//   const navigationPromises = exercicesList.reverse().map(async (firstLayer) => {
//     await page.goto(`${firstLayer[1]}`, { waitUntil: "networkidle0" });
//     await page.waitForNavigation({ waitUntil: "networkidle0" });
//   });
//   await Promise.all(navigationPromises);
// }
