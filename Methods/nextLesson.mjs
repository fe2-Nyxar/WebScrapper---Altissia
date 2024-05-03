async function currentStateOfMissions(page) {
  await page.waitForSelector("ol li.mission-item");
  const AllMissions = await page.evaluate(() => {
    const missions = document.querySelectorAll("ol li.mission-item");
    let liList = [];
    missions.forEach((mission) => {
      let button = mission.querySelector("button.btn.mission-header");
      button.click();
      let LIelements = mission.querySelectorAll(
        "ul.mission-lessons-list li.mission-lesson-item "
      );

      liList.push(
        Array.from(LIelements).map((li) => {
          let completedLi = li.querySelector(
            "a.new-card div.lesson-card-content div.circle-progression-container div.circle-progression-success-icon"
          );
          if (completedLi === null) {
            let lessonTitle = li.querySelector(
              "a.new-card > div.lesson-card-content > p.lesson-title"
            );
            let aTag = li.querySelector("a.new-card");
            href = aTag.getAttribute("href");
            return [lessonTitle.textContent.trim(), href];
          }
        })
      );
    });
    let flattenedList = liList.flat();

    return flattenedList;
  });
  return AllMissions.filter((item) => item !== null);
}

export async function nextLesson(page, inspect) {
  const flattenedList = await currentStateOfMissions(page);
  return await processList(page, flattenedList.reverse());
}

async function processList(page, MissionsList) {
  Object.values(MissionsList).forEach(async (output) => {
    await page.goto(`https://app.ofppt-langues.ma/platform/${output[1]}`, {
      waitUntil: "networkidle0",
    });
  });
  return MissionsList.length - 1;
}

// async function processList(MissionList, page) {
//   const navigationPromises = MissionList.map(async (output) => {
//     if (output[1] === false) {
//       await page.goto(`https://app.ofppt-langues.ma/platform/${output[2]}`, {
//         waitUntil: "networkidle0",
//       });
//       await page.waitForNavigation();
//     }
//   });
//   await Promise.all(navigationPromises);
// }
