const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function scrape() {
  try {
    const url = "https://eksisozluk.com/debe";
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const $ = cheerio.load(data);
    const contentHtml = $(".topic-list partial").prop("outerHTML") || "";

    // partial-index içindeki <li> elemanlarını çek
    let listItemsHtml = "<ol>";
    $("#partial-index li").each((i, el) => {
      const linkHtml = $(el).html();
      listItemsHtml += `
        <li>
          ${linkHtml}
          <input type="checkbox" name="check-${i}" />
        </li>
      `;
    });
    listItemsHtml += "</ol>";

    // 🔹 Buton + Script kodu
    const buttonAndScript = `
<button id="fetchEntries">Seçilenleri Çek</button>
<button id="openEntry">Entry Dosyasını Aç</button>
<script>
document.getElementById("fetchEntries").addEventListener("click", async () => {
  const checkedLinks = [];
  document.querySelectorAll("ol li input[type=checkbox]:checked").forEach(cb => {
    const link = cb.parentElement.querySelector("a").getAttribute("href");
    checkedLinks.push("https://eksisozluk.com" + link);
  });

  const response = await fetch("/scrape-entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ links: checkedLinks })
  });

  const result = await response.text();
  alert("entry.html dosyası güncellendi!");
});
document.getElementById("openEntry").addEventListener("click", () => {
  window.open("entry.html", "_blank");
});

</script>
`;

    // 🔹 HTML çıktısını hazırla
    const finalHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>DEBE</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h2>Partial Index Listesi</h2>
  ${contentHtml}
  ${listItemsHtml}
  ${buttonAndScript}
</body>
</html>
`;

    fs.writeFileSync("debe.html", finalHtml, "utf-8");
    console.log("Partial-index listesi ve buton debe.html dosyasına yazıldı!");
  } catch (err) {
    console.error("Hata:", err.message);
  }
}

scrape();
