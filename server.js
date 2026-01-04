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
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
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
