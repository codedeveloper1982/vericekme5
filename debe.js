const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function scrape() {
  try {
    const url = "https://eksisozluk.com/debe";
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Cookie": "iq=5481e2b2742d48aa836be99b8a8de117; OptanonAlertBoxClosed=2026-05-09T05:05:17.889Z; __gads=ID=59ec26d1952f0688:T=1778303110:RT=1778393463:S=ALNI_MbxHzgVNu2BL2X4TvSezQLL8PmI4A; __gpi=UID=00001374da328019:T=1778303110:RT=1778393463:S=ALNI_MZMrgPoKSWbAZK0-sJ_Lds_1M32Lw; __eoi=ID=2889f18227c11446:T=1778303110:RT=1778393463:S=AA-AfjaVpuAoi_7N0V1-6WkZPl3I; ecuid=Az97KRq0t5pycZIKQb9GV6mZ0Hh2qvIBhc652xJLn4vpE+aeToI0/h/Co9D0qXpxFVWaPEn0wLnvxyD/JfIonA==; ecs=ccDnLycx5aw8iRpi2uo7c2te8JmLZjKULVY0eEq2TBFoCGyKNSGtXTus2X/z0AxU+p+3usG5JkAijA22HqsSIA==; __gfp_cap=KlGrlMXGGM5qnxlG6ehsGRGKSaGGKnm7RMZa1loHGxsSYvrQsG..; eksi_up=useDarkTheme=1; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CQnSakAQnSakAEsACBTRCnFoAP_gAEPgACiQMGoB_C7EbCFCiDJ3IKMEMAhHABBAYsAwAAYAAgAADBIQIAQCgkEYBASAFCACCAAAKASBAAAgCAAAAUAAIAAFAABAAAwAIBAIIAAAgAAAAEAAAAAACIAAEQCAAAAEAEAAkAgAAAIAWEAAAAAAAACBAAAAAAAAAAAAAAAABAEAAQAAQAAAAAAAiAAAAAAAABAIAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAABAAAAAAAQgAAAAAAAAAAAAAAAAAAEAAAAAAIMGoB_C7EbCFCiDBXIKMEMAhXABAAYsAwAAYAAgAADBIQIAQCkkESBACAECAACAAAIAQBAAAoAAgAAEAAAAAVAABAAAwAIBAIAEAAgAAAQEAAAAAACIAAEQCAAAAEAEAAgAgAAAIAWEAAAAAAAACBAAAAAAAAAAAAAAAAAAEAACAAwAAAAAAAiAAAAAAAABAIEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAEAAAAAAAAAAAAAAAEAAAAAAIAA.IMGoB_C7EbCFCiDJ3IKMEMAhXABBAYsAwAAYAAgAADBIQIAQCkkEaBASAFCACCAAAKASBAAAoCAgAAUAAIAAVAABAAAwAIBAIIEAAgAAAQEAAAAAACIAAEQCAAAAEAEAAkAgAAAIAWEAAAAAAAACBAAAAAAAAAAAAAAAABAEAASAAwAAAAAAAiAAAAAAAABAIEAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAABAAAAAAAQgAAEAAAAAAAAAAAAAAAEAAAAAAIA.f_AAAAAAAAA%22%2C%222~61.89.122.161.184.196.230.314.340.442.445.494.550.576.827.1025.1029.1033.1046.1047.1051.1097.1126.1166.1301.1342.1415.1725.1942.1958.1987.2068.2072.2074.2107.2213.2219.2223.2224.2328.2331.2416.2501.2567.2568.2575.2657.2778.2869.2878.2908.2920.2963.3005.3023.3126.3235.3253.3309.3731.6931.8931.13731.15731.33931~dv.%22%2C%224F65948E-A8D3-41B3-8F0D-31A619F77FAC%22%5D%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%22c34b5857-231c-400e-8279-2c89340abc64%5C%22%2C%5B1780744489%2C608000000%5D%5D%22%5D%5D%5D; _gid=GA1.2.3161505.1784494111; a=tE0w1353R7zwZ6Fiaik59rvw20Ye7LSSJq1HXAfpabY+HeL4O3Ctklh/r7PxoFjOOKrLt0lC30xwlCfi+Wnig1/H/b/K7i8aSclI4GpEikSM1WtWd3+e8o/yJYZBTi5u04SxJDcp5Q/o6zVqv43lsvjiEe4YnAlUkqIkit+4rECVTGEsqKAX4EABs5zwbheW; _ga=GA1.1.1041604729.1778303113; ASP.NET_SessionId=cec44bb4bptw5tove41hngt0; __RequestVerificationToken=0IuFDMwQGP4XNeW82IKcr0YDdXXVGNem4EGHI4wA9Wej2Bci05YRI7BwqAFvNt6ywmPfm10x1bQnbOgYRyGev2_H1P7S9Tr8SwaxqdmfX7k1; led_msg=; led_evt=; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Jul+28+2026+19%3A56%3A09+GMT%2B0300+(T%C3%BCrkiye+Standart+Saati)&version=6.34.0&isIABGlobal=false&consentId=02ab7f77-a1b4-4920-ba0c-cd4a06605cd0&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&hosts=H32%3A1%2CH43%3A1%2CH33%3A1%2CH34%3A1%2CH35%3A1%2CH2%3A1%2CH3%3A1%2CH4%3A1%2CH5%3A1%2CH36%3A1%2CH6%3A1%2CH7%3A1%2CH9%3A1%2CH10%3A1%2CH37%3A1%2CH11%3A1%2CH12%3A1%2CH45%3A1%2CH13%3A1%2CH27%3A1%2CH14%3A1%2CH38%3A1%2CH39%3A1%2CH44%3A1%2CH16%3A1%2CH18%3A1%2CH40%3A1%2CH19%3A1%2CH20%3A1%2CH21%3A1%2CH41%3A1%2CH42%3A1%2CH22%3A1&genVendors=&AwaitingReconsent=false&geolocation=TR%3B16; led_tra=1; __gfp_64b=EvhsJjIxrx1JXWpwhMqPd3L4_4hScw7m65DKE06kSSX.l7|1778303110|2|||8:1:80; FCNEC=%5B%5B%22AKsRol8f5Y39uz38Cv1acySgvnKNhxMa0QUIXuZ-WUMbzm4ab5qkVzUN3Nq1C3UY8Vtnkyv292ODZFIe0MBd3gcs76VtI_jKE3jOLgrzZs-4uKIGTEJ9SIwLcEapwxMs88iFKLDRcKYif7Sgi-DtxmOneRDgFfnESQ%3D%3D%22%5D%5D; _ga_0SCWQ0JSDM=GS2.1.s1785257770$o248$g1$t1785257991$j55$l0$h0",
    "Referer": "https://eksisozluk.com/debe"
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