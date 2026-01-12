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

    // 🔹 Toplu Seçim Kutuları (HTML yapısına eklendi)
    const bulkSelectorsHtml = `
    <div id="bulk-selectors" style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; background: #f9f9f9;">
      <strong>Toplu Seçim:</strong><br>
      <label><input type="checkbox" id="group1"> 1-11 Arası Seç</label> | 
      <label><input type="checkbox" id="group2"> 12-22 Arası Seç</label> | 
      <label><input type="checkbox" id="group3"> 23-33 Arası Seç</label> | 
      <label><input type="checkbox" id="group4"> 33+ Sonrasını Seç</label>
    </div>
    `;

    // 🔹 Liste Elemanlarını Hazırla
    let listItemsHtml = "<ol id='entry-list'>";
    $("#partial-index li").each((i, el) => {
      const linkHtml = $(el).html();
      // i sıfırdan başladığı için sınıfları i'ye göre vereceğiz
      listItemsHtml += `
        <li>
          ${linkHtml}
          <input type="checkbox" class="entry-check" data-index="${i}" name="check-${i}" />
        </li>
      `;
    });
    listItemsHtml += "</ol>";

    // 🔹 Gelişmiş Script Kodu
    const buttonAndScript = `
<button id="fetchEntries">Seçilenleri Çek</button>
<button id="openEntry">Entry Dosyasını Aç</button>

<script>
// Toplu seçim kutularını dinle
const groupSelectors = [
  { id: "group1", start: 0, end: 10 },
  { id: "group2", start: 11, end: 21 },
  { id: "group3", start: 22, end: 32 },
  { id: "group4", start: 33, end: Infinity }
];

groupSelectors.forEach(group => {
  document.getElementById(group.id).addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    const allChecks = document.querySelectorAll(".entry-check");
    
    allChecks.forEach((cb, index) => {
      if (index >= group.start && index <= group.end) {
        cb.checked = isChecked;
      }
    });
  });
});

// Veri çekme butonu
document.getElementById("fetchEntries").addEventListener("click", async () => {
  const checkedLinks = [];
  document.querySelectorAll(".entry-check:checked").forEach(cb => {
    const link = cb.parentElement.querySelector("a").getAttribute("href");
    checkedLinks.push("https://eksisozluk.com" + link);
  });

  if(checkedLinks.length === 0) {
    alert("Lütfen en az bir başlık seçin!");
    return;
  }

  const response = await fetch("/scrape-entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ links: checkedLinks })
  });

  alert("Seçilen " + checkedLinks.length + " adet başlık işleniyor...");
});

document.getElementById("openEntry").addEventListener("click", () => {
  window.open("entry.html", "_blank");
});
</script>
`;

    // 🔹 Final HTML
    const finalHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>DEBE - Seçim Paneli</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    ol li { margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
    input[type="checkbox"] { transform: scale(1.2); margin-left: 10px; cursor: pointer; }
    button { padding: 10px 20px; cursor: pointer; background: #008000; color: white; border: none; border-radius: 4px; }
    #openEntry { background: #555; }
  </style>
</head>
<body>
  <h2>Ekşi Sözlük DEBE Listesi</h2>
  ${bulkSelectorsHtml}
  ${listItemsHtml}
  <hr>
  ${buttonAndScript}
</body>
</html>
`;

    fs.writeFileSync("debe.html", finalHtml, "utf-8");
    console.log("debe.html başarıyla güncellendi! Seçim kutuları eklendi.");
  } catch (err) {
    console.error("Hata:", err.message);
  }
}

scrape();