export async function login(page, username, password) {
  await page.waitForSelector("#i0116");
  await page.waitForSelector("#idSIButton9");
  const isLoggedIn = await page.evaluate(() => {
    return document.querySelectorAll("#i0116 #idSIButton9 #i0118") !== null;
  });
  if (!isLoggedIn) {
    return;
  }
  // ? ------ step 1-------
  try {
    await page.type("#i0116", username);
    await page.waitForFunction(
      (username) => {
        const inputField = document.querySelector("input#i0116");
        return inputField.value.trim() === username.trim();
      },
      {},
      username
    );

    await page.click("#idSIButton9");

    // ? ------ step 2 -------
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.waitForSelector("#i0118");
    await page.waitForSelector("#idSIButton9");
    await new Promise((resolve) => setTimeout(resolve, 500));
    await page.type("#i0118", password);
    await page.click("#idSIButton9");
    // await new Promise((resolve) => setTimeout(resolve, 50));

    await page.waitForNavigation({ waitUntil: "networkidle2" });
    await page.click("#idSIButton9");
    await page.waitForNavigation({ waitUntil: "load" });
    await page.goto(
      "https://app.ofppt-langues.ma/platform/#/learning-path?interfaceLg=fr_FR&customer=OFPPT"
    );
  } catch (err) {
    console.log(err);
    await page.close();
  }
}
