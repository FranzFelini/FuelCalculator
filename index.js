import fs from "fs";
import puppeteer from "puppeteer";

const url = "https://www.tolls.eu/fuel-prices";

const main = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    console.log("Proceeding to page");

    const allData = await page.evaluate(() => {
      const rows = document.querySelectorAll(".tr");
      const data = [];

      rows.forEach((row) => {
        const countryDiv = row.querySelector(".th");
        const priceDivs = row.querySelectorAll(".td");

        if (countryDiv && priceDivs.length >= 2) {
          const country = countryDiv.innerText.trim();

          const gasoline95 =
            priceDivs[0]?.childNodes[0]?.textContent.trim() || "N/A";
          const diesel =
            priceDivs[1]?.childNodes[0]?.textContent.trim() || "N/A";

          data.push({ country, gasoline95, diesel });
        }
      });
      return data;
    });

    console.log(allData);

    try {
      fs.writeFileSync("fuel.json", JSON.stringify(allData, null, 2));
      console.log("File created");
    } catch (err) {
      console.error("Error writing file", err);
    }
  } catch (error) {
    console.error("Error navigating to the page:", error);
  } finally {
    await browser.close();
  }
};

main();
