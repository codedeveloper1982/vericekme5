const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/scrape-entries", async (req, res) => {
  const { links } = req.body;
  let allHtml = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Entries</title><link rel='stylesheet' href='style.css'></head><body>";

  for (const url of links) {
    try {
const { data } = await axios.get(url, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Cookie": "iq=ade96488b817442aac59c3e8c07063df; eksi_up=useDarkTheme=1; OptanonAlertBoxClosed=2025-04-26T20:50:33.631Z; __gfp_cap=KlGSHRXGGM5qEGomoHntQGMKSaGGKQQWMaZcms8GhaS1R5nG; __gads=ID=05aac0ad4e636e6c:T=1750675917:RT=1755897625:S=ALNI_MYztwMOZI382ejjZ2x37rY4p-nYeA; __gpi=UID=00001090f01687d2:T=1745672690:RT=1755897625:S=ALNI_MbSxSkMIwbsJf9IsYcUiwwKdGBhNA; cto_bundle=A4x8M191UnRyZHpaNWRocjZNUFdZemlMUFRnVTkzbnVhVzNnY2ZwNDg1bzNRekU1SG9OeXNJRHI1dGQwQUlyMFJvV01VNnpSbERObkVQd1JCOU1xeTFURzUzMzZGRjBjSE5HJTJCU0VVaTklMkJYVXVpYmRsR1lPaXF3WDJINlo1bzJkc0czSUlQMTR6bG9Ra0xoUXhEMUQySnFPcUZRJTNEJTNE; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CQSU_AAQSU_AAEsACBTRBtFoAP_gAEPgACiQINJD7C7FbSFCyD5zaLsAMAhHRsAAQoQAAASBAmABQAKQIAQCgkAYFASABAACAAAAICRBIQIECAAAAUAAQAAAAAAEAAAAAAAIIAAAgAEAAAAIAAACAIAAEAAIAAAAEAAAmAgAAIIACAAAgAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAQNVSD2F2K2kKFkHCmwXYAYBCujYAAhQgAAAkCBMACgAUgQAgFJIAgCIEAAAAAAAAAQEiCQAAQABAAAIACgAAAAAAIAAAAAAAQQAABAAIAAAAAAAAEAQAAIAAQAAAAIAABEhAAAQQAEAAAAAAAQAAA.f_AAAAAAAAA%22%2C%222~70.89.93.108.122.149.184.196.236.259.311.313.314.323.358.415.442.486.494.495.540.574.609.723.864.981.1029.1048.1051.1095.1097.1126.1205.1276.1301.1365.1415.1449.1514.1570.1577.1598.1651.1716.1735.1753.1765.1870.1878.1889.1958.1960.2072.2253.2299.2373.2415.2506.2526.2531.2568.2571.2575.2624.2677.2778~dv.%22%2C%226021A734-B4A9-41C3-A17B-FB7D74FB0F6E%22%5D%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%2295d7f60d-ee4a-4725-924d-9eae42797f59%5C%22%2C%5B1761587162%2C106000000%5D%5D%22%5D%5D%5D; cf_clearance=MOQlisN7iQI8K6OFGTe9x06K8cnJ0GJ.z0YjrVxvwaM-1765813542-1.2.1.1-YNAxhYv.emcIhLRyiLdf4ks.p8h538gbUCQWHEO8jEZsmzUfBy_1UAu9TPdiQEc0zbNIDFVWBul_I8UDY3ieac8_fnJYdGvDULCtjxxOztCfs5TyvHlNltOQ_sJR24o0gVhhgQIiLuhEe8HvPDq5rqD48T92tSbCGOq1p.CfQrcIxWfb1kxK3WHyc6uyGu5gvROh.pbfu5khFJnf9g5wP6rxxWAVzlf7brJkldhmucU; _gid=GA1.2.442251475.1766553819; a=TQZ2M+15Qb/Q+kA27BBI9dFh9DwLEFckUCepv4Xp+iZVrOrpWGEhCVb+EKEK8gP/TFJMrEnXlQyiCMNQrx7psvOqEZsP6XQPcB+3j7lIb77+Vcn3HSGrVGwgFcLu4yd4eMOwKX1prKJbSoVxVk2fG+u+0FfWbeCfgP08tg3uvYaf0rN9YNygEZOzy09FFqds; _ga=GA1.1.1615830138.1745672691; __gfp_64b=RDHRqld3SiAWcJsJQnifCe7yCESn4ObqgEH_TDG9xuT.W7|1745672690|2|||8:1:80; led_msg=; led_evt=; ASP.NET_SessionId=3p3yuwbaqbo0n4o0wpuhzpzp; __RequestVerificationToken=OaPNoXYL6yf0LPptwd7nx7fGftZfnfHvbTmoy9zrZ2TfqxPEYV9Xhje4FGGJ1mt02fFkQNuce6VMUMhs6iz6n56fTCMImbwFjnI_vdfZ6JQ1; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Jan+04+2026+10%3A16%3A08+GMT%2B0300+(GMT%2B03%3A00)&version=6.34.0&isIABGlobal=false&consentId=48da67ca-1b6f-4a91-ab63-361dc3d2e8cd&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&hosts=H32%3A1%2CH43%3A1%2CH33%3A1%2CH34%3A1%2CH35%3A1%2CH2%3A1%2CH3%3A1%2CH4%3A1%2CH5%3A1%2CH36%3A1%2CH6%3A1%2CH7%3A1%2CH9%3A1%2CH10%3A1%2CH37%3A1%2CH11%3A1%2CH12%3A1%2CH45%3A1%2CH13%3A1%2CH27%3A1%2CH14%3A1%2CH38%3A1%2CH39%3A1%2CH44%3A1%2CH16%3A1%2CH18%3A1%2CH40%3A1%2CH19%3A1%2CH20%3A1%2CH21%3A1%2CH41%3A1%2CH42%3A1%2CH22%3A1&genVendors=&AwaitingReconsent=false&geolocation=TR%3B16; FCNEC=%5B%5B%22AKsRol-CYNt3IccLp9sx-uM0T440kgxnV_5kmvHNGyDtuuovzdvrb0q8gWK1GMd1VrM6-wHatUcX3BoOaqQVvd95DnLbUAmH4-sYMr70yNK-hL35ycYTxKVcktNiTLmxnQSEtBl6XHA4srnc4zCOC_1wJq0XpoQauw%3D%3D%22%5D%5D; led_tra=; _ga_0SCWQ0JSDM=GS2.1.s1767516048$o1190$g0$t1767516048$j60$l0$h0",
    "Referer": "https://eksisozluk.com/"
  }
});


      const $ = cheerio.load(data);

      const titleHtml = $("#title").prop("outerHTML") || "";
      const contentHtml = $("#entry-item-list").prop("outerHTML") || "";
      const oncekisonki = $("#debe-nav").prop("outerHTML") || "";

      allHtml += `
        <section>
          ${titleHtml}
          ${contentHtml}
          ${oncekisonki}
        </section>
        <hr/>
      `;
    } catch (err) {
      allHtml += `<p>Hata: ${url} için veri alınamadı (${err.message})</p>`;
    }
  }

  // 🔹 Senin verdiğin scripti buraya ekliyoruz
  allHtml += `

<script>
${/* senin verdiğin kodu buraya yapıştırıyoruz */""}
var punto = 57;
var scrl = 2;
var artis = 1;
var ilk_bas = false;
var ilk_bas_tekrari = 3;
var hiz = 0;
var yon = 0;
var dongu = null;

var boyut = sessionStorage.getItem("boyut") ? parseInt(sessionStorage.getItem("boyut")) : punto;
var metinAlanlari = document.querySelectorAll(".content");
var style = document.createElement('style');
style.innerHTML = \`
    #kutu {
        position: fixed;
        top: 150px;
        left: 1250px;
        transform: translateY(-50%);
        background: rgba(40, 40, 40, 0.9);
        color: white;
        padding: 10px;
        border-radius: 10px;
        z-index: 9999;
        font-family: 'Sitka Text', serif;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        border: 1px solid #444;
        width: 70px;
    }
    #kutu button { 
        cursor: pointer; 
        padding: 8px 0;
        border-radius: 4px;
        border: none;
        background: #555;
        color: white;
        font-weight: bold;
        transition: 0.2s;
    }
    #kutu button:hover { background: #333333ff; }
    #kutu #dur { background: #3b3b3bff; }
    #kutu #save { background: #3d3d3dff; }
    #kutuheader { 
        font-size: 13px; 
        line-height: 1.4;
        color: #17FF00; 
        margin-bottom: 5px;
        word-wrap: break-word;
    }
\`;
document.head.appendChild(style);

var btn = document.createElement("div");
btn.id = "kutu";

var header = document.createElement("div");
header.id = "kutuheader";
header.innerHTML = "%0<br>0:00<br>hız:0";

function createBtn(txt, id, func) {
    let b = document.createElement("button");
    b.innerHTML = txt;
    b.id = id;
    b.onclick = func;
    return b;
}

btn.appendChild(header);
btn.appendChild(createBtn("+1", "up", yukari));
btn.appendChild(createBtn("-1", "down", asagi));
btn.appendChild(createBtn("DUR", "dur", dur));
btn.appendChild(createBtn("<<", "sizedown", sizedown));
btn.appendChild(createBtn(">>", "sizeup", sizeup));
btn.appendChild(createBtn("KYDT", "save", save));

document.body.appendChild(btn);

const demoArea = document.getElementById("demo");
if(demoArea) demoArea.style.fontSize = boyut + "px";


function yukari() {
    yon = yon - scrl;
    hiz--;
    try {
        clearInterval(dongu);
    } catch {
        alert("döngü kırılamadı")
    }
    git();
}
function asagi() {
    if (ilk_bas == true) {
        yon = yon + scrl;
        hiz++;
    } else {
        for (var i = 0; i < ilk_bas_tekrari; i++)
            yon = yon + scrl;
        hiz = ilk_bas_tekrari;
    }
    ilk_bas = true;
    try {
        clearInterval(dongu);
    } catch {
        alert("döngü kırılamadı")
    }
    git();
}
function dur() {
    ilk_bas = false;
    if (hiz != 0) {
        ilk_bas_tekrari = hiz;
    }
    yon = 0;
    hiz = 0;
}
function git() {
    if (yon == 0) {
        return;
    } else {
        var intervlhiz = 480 / Math.abs(yon);
        dongu = setInterval(scrollWin, intervlhiz);
        function scrollWin() {
            miktar = Math.round((document.body.scrollTop / (document.body.scrollHeight - window.innerHeight)) * 100);

            kalan_sure = (((document.body.scrollHeight - window.innerHeight) - document.body.scrollTop) / 1) * ((intervlhiz) / 540);
            dakika = Math.floor(Math.round(kalan_sure) / 60);
            saniye = Math.round(kalan_sure) - dakika * 60;
            if (saniye < 10) {
                header.innerHTML = "%" + miktar + "<br>" + dakika + ":0" + saniye + "<br>hız:" + hiz;
            } else {
                header.innerHTML = "%" + miktar + "<br>" + dakika + ":" + saniye + "<br>hız:" + hiz;
            }
            window.scrollTo(0, window.scrollY + 1 * Math.sign(yon));
        }
    }
}
metinAlanlari.forEach(function(el) {
    el.style.fontSize = boyut + "px";
});

function sizedown() {
    boyut -= artis;
    // Liste içerisindeki her bir elementi tek tek gez ve puntosunu değiştir
    metinAlanlari.forEach(function(el) {
        el.style.fontSize = boyut + "px";
    });
}

function sizeup() {
    boyut += artis;
    // Liste içerisindeki her bir elementi tek tek gez ve puntosunu değiştir
    metinAlanlari.forEach(function(el) {
        el.style.fontSize = boyut + "px";
    });
}
function save() { sessionStorage.setItem("boyut", boyut); alert("Ayarlar Kaydedildi!"); }
</script>
`;

  allHtml += "</body></html>";

  fs.writeFileSync("entry.html", allHtml, "utf-8");
  res.send("OK");
});


app.listen(3000, () => console.log("Server çalışıyor: http://localhost:3000"));
