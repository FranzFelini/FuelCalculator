import fs from "fs";
import puppeteer from "puppeteer";

const url = "https://www.tolls.eu/fuel-prices";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  console.log("Proceeding to page");

  const allDivs = await page.evaluate(() => {
    const divs = document.querySelectorAll("div.th");

    return Array.from(divs)
      .slice(5, 20)
      .map((div) => {
        const country = div.innerText;
        return { country };
      });
  });

  console.log(allDivs);

  await browser.close();
  try {
    fs.writeFileSync("fuel.json", JSON.stringify(allDivs, null, 2));
    console.log("File created");
  } catch (err) {
    console.error("Error writing file", err);
  }
};

main();
