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
  let allHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <title>Entries</title>
  <link rel='stylesheet' href='style.css'>
  <script async src="//www.instagram.com/embed.js"></script>
</head>
<body>`;

  for (const url of links) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Cookie": "iq=5481e2b2742d48aa836be99b8a8de117; OptanonAlertBoxClosed=2026-05-09T05:05:17.889Z; __gads=ID=59ec26d1952f0688:T=1778303110:RT=1778393463:S=ALNI_MbxHzgVNu2BL2X4TvSezQLL8PmI4A; __gpi=UID=00001374da328019:T=1778303110:RT=1778393463:S=ALNI_MZMrgPoKSWbAZK0-sJ_Lds_1M32Lw; __eoi=ID=2889f18227c11446:T=1778303110:RT=1778393463:S=AA-AfjaVpuAoi_7N0V1-6WkZPl3I; ecuid=Az97KRq0t5pycZIKQb9GV6mZ0Hh2qvIBhc652xJLn4vpE+aeToI0/h/Co9D0qXpxFVWaPEn0wLnvxyD/JfIonA==; ecs=ccDnLycx5aw8iRpi2uo7c2te8JmLZjKULVY0eEq2TBFoCGyKNSGtXTus2X/z0AxU+p+3usG5JkAijA22HqsSIA==; __gfp_cap=KlGrlMXGGM5qnxlG6ehsGRGKSaGGKnm7RMZa1loHGxsSYvrQsG..; eksi_up=useDarkTheme=1;",
          "Referer": "https://eksisozluk.com/"
        }
      });

      const $ = cheerio.load(data);
      const entryLinks = $(".content a").toArray();

      for (const el of entryLinks) {
        const $el = $(el);
        const href = $el.attr("href") || "";

        // 1. Ekşi Sözlük Görselleri (soz.lk/i/CODE)
        if (href.includes("soz.lk/i/")) {
          const code = href.split("/i/")[1]?.split("?")[0];
          if (code) {
            try {
              const imgPage = await axios.get(`https://eksisozluk.com/img/${code}`, {
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
              });
              const $imgDoc = cheerio.load(imgPage.data);
              const imgUrl = $imgDoc("#image-zoom").attr("href") || $imgDoc("#image").attr("src");
              if (imgUrl) {
                $el.replaceWith(`<img src="${imgUrl}" style="max-width:100%; display:block; margin:10px 0; border-radius:8px;">`);
                continue;
              }
            } catch (err) {
              console.error("Görsel çekilemedi:", code, err.message);
            }
          }
        }

        // 2. YouTube Music
        const ytMusicMatch = href.match(/music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
        if (ytMusicMatch && ytMusicMatch[1]) {
          $el.replaceWith(`<iframe src="https://www.youtube.com/embed/${ytMusicMatch[1]}" width="100%" height="200" style="margin:10px 0; border:none; border-radius:8px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
          continue;
        }

        // 3. YouTube (Normal & Shorts)
        const ytMatch = href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([a-zA-Z0-9_-]+)/);
        if (ytMatch && ytMatch[1]) {
          $el.replaceWith(`<iframe src="https://www.youtube.com/embed/${ytMatch[1]}" width="100%" height="360" style="margin:10px 0; border:none; border-radius:8px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`);
          continue;
        }

        // 4. Spotify
        const spotifyMatch = href.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
        if (spotifyMatch && spotifyMatch[1] && spotifyMatch[2]) {
          const h = spotifyMatch[1] === 'track' ? "152" : "352";
          $el.replaceWith(`<iframe src="https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}" width="100%" height="${h}" style="margin:10px 0; border:none; border-radius:12px;" allow="encrypted-media"></iframe>`);
          continue;
        }

        // 5. Instagram (Reels & Post)
        const instaMatch = href.match(/instagram\.com\/(?:reels|reel|p)\/([a-zA-Z0-9_-]+)/);
        if (instaMatch && instaMatch[1]) {
          $el.replaceWith(`<iframe class="instagram-media" src="https://www.instagram.com/p/${instaMatch[1]}/embed" width="100%" height="700" style="margin:10px 0; border:none; border-radius:8px;" scrolling="no"></iframe>`);
          continue;
        }

        // 6. Streamable
        const streamableMatch = href.match(/streamable\.com\/([a-zA-Z0-9_-]+)/);
        if (streamableMatch && streamableMatch[1]) {
          $el.replaceWith(`<iframe src="https://streamable.com/e/${streamableMatch[1]}" width="100%" height="360" style="margin:10px 0; border:none; border-radius:8px;" allowfullscreen></iframe>`);
          continue;
        }

        // Diğer site içi linkleri düzelt
        if (href && !href.startsWith("http")) {
          $el.attr("href", "https://eksisozluk.com" + href);
          $el.attr("target", "_blank");
        }
      }

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

  // Kontrol Paneli & Otomatik Kaydırma Scripti
  allHtml += `
<script>
    var punto = 60;
    var scrl = 2;
    var artis = 3;
    var ilk_bas = false;
    var ilk_bas_tekrari = 12;
    var hiz = 0;
    var yon = 0;
    var dongu = null;

    var boyut = sessionStorage.getItem("boyut") ? parseInt(sessionStorage.getItem("boyut")) : punto;
    
    var style = document.createElement('style');
    style.innerHTML = \`
        #kutu { position: fixed; top: 150px; right: 20px; background: rgba(40, 40, 40, 0.9); color: white; padding: 10px; border-radius: 10px; z-index: 9999; font-family: sans-serif; text-align: center; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 1px solid #444; width: 80px; }
        #kutu button { cursor: pointer; padding: 8px 0; border-radius: 4px; border: none; background: #555; color: white; font-weight: bold; }
        #kutu button:hover { background: #17FF00; color: black; }
        #kutuheader { font-size: 12px; color: #17FF00; margin-bottom: 5px; }
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

    function metinleriGuncelle() {
        document.querySelectorAll(".content").forEach(el => {
            el.style.fontSize = boyut + "px";
        });
    }

    function yukari() { yon -= scrl; hiz--; durdur(); git(); }
    function asagi() { 
        if (!ilk_bas) { yon += (scrl * ilk_bas_tekrari); hiz = ilk_bas_tekrari; } 
        else { yon += scrl; hiz++; }
        ilk_bas = true; durdur(); git(); 
    }
    function durdur() { clearInterval(dongu); }
    function dur() { ilk_bas = false; if (hiz != 0) {ilk_bas_tekrari = hiz;} yon = 0; hiz = 0; durdur(); }

    function git() {
        if (yon === 0) return;
        var intervlhiz = 480 / Math.abs(yon);
        dongu = setInterval(() => {
            var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            var currentScroll = window.scrollY;
            var miktar = Math.round((currentScroll / maxScroll) * 100);

            var kalanMesafe = maxScroll - currentScroll;
            var pxPerStep = Math.sign(yon); 
            var stepsNeeded = kalanMesafe / Math.abs(pxPerStep);
            var kalanSureMs = stepsNeeded * intervlhiz;

            var dakika = Math.floor(kalanSureMs / 60000);
            var saniye = Math.floor((kalanSureMs % 60000) / 1000);

            header.innerHTML = "%" + miktar + "<br>" +
                dakika + ":" + (saniye < 10 ? "0" + saniye : saniye) +
                "<br>hız:" + hiz;

            window.scrollBy(0, pxPerStep);
        }, intervlhiz);
    }

    function sizedown() { boyut -= artis; metinleriGuncelle(); }
    function sizeup() { boyut += artis; metinleriGuncelle(); }
    function save() { sessionStorage.setItem("boyut", boyut); alert("Boyut kaydedildi: " + boyut); }

    metinleriGuncelle();
</script>
`;

  allHtml += "</body></html>";

  fs.writeFileSync("entry.html", allHtml, "utf-8");
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Server çalışıyor: http://localhost:3000");
  console.log("📂 1. Tarayıcıda 'entry.html' dosyasını değil, http://localhost:3000/entry.html adresini açın.");
});

/*


node debe.js 
node server.js






*/