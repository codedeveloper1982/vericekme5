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
          "Cookie": "iq=5481e2b2742d48aa836be99b8a8de117; OptanonAlertBoxClosed=2026-05-09T05:05:17.889Z; __gads=ID=59ec26d1952f0688:T=1778303110:RT=1778393463:S=ALNI_MbxHzgVNu2BL2X4TvSezQLL8PmI4A; __gpi=UID=00001374da328019:T=1778303110:RT=1778393463:S=ALNI_MZMrgPoKSWbAZK0-sJ_Lds_1M32Lw; __eoi=ID=2889f18227c11446:T=1778303110:RT=1778393463:S=AA-AfjaVpuAoi_7N0V1-6WkZPl3I; ecuid=Az97KRq0t5pycZIKQb9GV6mZ0Hh2qvIBhc652xJLn4vpE+aeToI0/h/Co9D0qXpxFVWaPEn0wLnvxyD/JfIonA==; ecs=ccDnLycx5aw8iRpi2uo7c2te8JmLZjKULVY0eEq2TBFoCGyKNSGtXTus2X/z0AxU+p+3usG5JkAijA22HqsSIA==; __gfp_cap=KlGrlMXGGM5qnxlG6ehsGRGKSaGGKnm7RMZa1loHGxsSYvrQsG..; eksi_up=useDarkTheme=1; FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CQnSakAQnSakAEsACBTRCnFoAP_gAEPgACiQMGoB_C7EbCFCiDJ3IKMEMAhHABBAYsAwAAYAAgAADBIQIAQCgkEYBASAFCACCAAAKASBAAAgCAAAAUAAIAAFAABAAAwAIBAIIAAAgAAAAEAAAAAACIAAEQCAAAAEAEAAkAgAAAIAWEAAAAAAAACBAAAAAAAAAAAAAAAABAEAAQAAQAAAAAAAiAAAAAAAABAIAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAABAAAAAAAQgAAAAAAAAAAAAAAAAAAEAAAAAAIMGoB_C7EbCFCiDBXIKMEMAhXABAAYsAwAAYAAgAADBIQIAQCkkESBACAECAACAAAIAQBAAAoAAgAAEAAAAAVAABAAAwAIBAIAEAAgAAAQEAAAAAACIAAEQCAAAAEAEAAgAgAAAIAWEAAAAAAAACBAAAAAAAAAAAAAAAAAAEAACAAwAAAAAAAiAAAAAAAABAIEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAEAAAAAAAAAAAAAAAEAAAAAAIAA.IMGoB_C7EbCFCiDJ3IKMEMAhXABBAYsAwAAYAAgAADBIQIAQCkkEaBASAFCACCAAAKASBAAAoCAgAAUAAIAAVAABAAAwAIBAIIEAAgAAAQEAAAAAACIAAEQCAAAAEAEAAkAgAAAIAWEAAAAAAAACBAAAAAAAAAAAAAAAABAEAASAAwAAAAAAAiAAAAAAAABAIEAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAABAAAAAAAQgAAEAAAAAAAAAAAAAAAEAAAAAAIA.f_AAAAAAAAA%22%2C%222~61.89.122.161.184.196.230.314.340.442.445.494.550.576.827.1025.1029.1033.1046.1047.1051.1097.1126.1166.1301.1342.1415.1725.1942.1958.1987.2068.2072.2074.2107.2213.2219.2223.2224.2328.2331.2416.2501.2567.2568.2575.2657.2778.2869.2878.2908.2920.2963.3005.3023.3126.3235.3253.3309.3731.6931.8931.13731.15731.33931~dv.%22%2C%224F65948E-A8D3-41B3-8F0D-31A619F77FAC%22%5D%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%22c34b5857-231c-400e-8279-2c89340abc64%5C%22%2C%5B1780744489%2C608000000%5D%5D%22%5D%5D%5D; _gid=GA1.2.3161505.1784494111; a=tE0w1353R7zwZ6Fiaik59rvw20Ye7LSSJq1HXAfpabY+HeL4O3Ctklh/r7PxoFjOOKrLt0lC30xwlCfi+Wnig1/H/b/K7i8aSclI4GpEikSM1WtWd3+e8o/yJYZBTi5u04SxJDcp5Q/o6zVqv43lsvjiEe4YnAlUkqIkit+4rECVTGEsqKAX4EABs5zwbheW; _ga=GA1.1.1041604729.1778303113; ASP.NET_SessionId=cec44bb4bptw5tove41hngt0; __RequestVerificationToken=0IuFDMwQGP4XNeW82IKcr0YDdXXVGNem4EGHI4wA9Wej2Bci05YRI7BwqAFvNt6ywmPfm10x1bQnbOgYRyGev2_H1P7S9Tr8SwaxqdmfX7k1; led_msg=; led_evt=; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Jul+28+2026+19%3A56%3A09+GMT%2B0300+(T%C3%BCrkiye+Standart+Saati)&version=6.34.0&isIABGlobal=false&consentId=02ab7f77-a1b4-4920-ba0c-cd4a06605cd0&interactionCount=2&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&hosts=H32%3A1%2CH43%3A1%2CH33%3A1%2CH34%3A1%2CH35%3A1%2CH2%3A1%2CH3%3A1%2CH4%3A1%2CH5%3A1%2CH36%3A1%2CH6%3A1%2CH7%3A1%2CH9%3A1%2CH10%3A1%2CH37%3A1%2CH11%3A1%2CH12%3A1%2CH45%3A1%2CH13%3A1%2CH27%3A1%2CH14%3A1%2CH38%3A1%2CH39%3A1%2CH44%3A1%2CH16%3A1%2CH18%3A1%2CH40%3A1%2CH19%3A1%2CH20%3A1%2CH21%3A1%2CH41%3A1%2CH42%3A1%2CH22%3A1&genVendors=&AwaitingReconsent=false&geolocation=TR%3B16; led_tra=1; __gfp_64b=EvhsJjIxrx1JXWpwhMqPd3L4_4hScw7m65DKE06kSSX.l7|1778303110|2|||8:1:80; FCNEC=%5B%5B%22AKsRol8f5Y39uz38Cv1acySgvnKNhxMa0QUIXuZ-WUMbzm4ab5qkVzUN3Nq1C3UY8Vtnkyv292ODZFIe0MBd3gcs76VtI_jKE3jOLgrzZs-4uKIGTEJ9SIwLcEapwxMs88iFKLDRcKYif7Sgi-DtxmOneRDgFfnESQ%3D%3D%22%5D%5D; _ga_0SCWQ0JSDM=GS2.1.s1785257770$o248$g1$t1785257991$j55$l0$h0",
          "Referer": "https://eksisozluk.com/"
        }
      });

      const $ = cheerio.load(data);

      $("a:not(.url)").each((i, el) => {
        const href = $(el).attr("href");
        if (href && !href.startsWith("http")) {
          $(el).attr("href", "https://eksisozluk.com" + href);
          $(el).attr("target", "_blank");
        }
      });

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

  // OTOMATİK KAYDIRMA & KONTROL PANELİ SCRİPTİ
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

  // MEDYA GÖMME SCRİPTİ (Görseller, YouTube, YT Music, Spotify, Instagram, Streamable)
  allHtml += `
<script>
(async function(){
  const imgLinks = document.querySelectorAll('a[href*="soz.lk/i/"]');
  for (const link of imgLinks) {
    const code = link.href.split('/i/')[1];
    if (code) {
      try {
        const res = await fetch('https://eksisozluk.com/img/' + code);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const imgUrl = doc.querySelector('#image-zoom')?.href || doc.querySelector('#image')?.src;

        if (imgUrl) {
          const img = document.createElement('img');
          img.src = imgUrl;
          img.style.maxWidth = "100%";
          img.style.display = "block";
          img.style.margin = "10px 0";
          img.style.borderRadius = "8px";
          link.parentNode.replaceChild(img, link);
        }
      } catch (err) {
        console.error("Görsel yüklenemedi:", code, err);
      }
    }
  }

  let hasInstagram = false;
  const allLinks = document.querySelectorAll('.content a');

  allLinks.forEach(link => {
    const href = link.href;

    let ytMatch = href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/))([a-zA-Z0-9_-]+)/);
    if (ytMatch && ytMatch[1]) {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + ytMatch[1];
      iframe.width = "100%";
      iframe.height = "360";
      iframe.style.margin = "10px 0";
      iframe.style.border = "none";
      iframe.style.borderRadius = "8px";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      link.parentNode.replaceChild(iframe, link);
      return;
    }

    let ytMusicMatch = href.match(/music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    if (ytMusicMatch && ytMusicMatch[1]) {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + ytMusicMatch[1];
      iframe.width = "100%";
      iframe.height = "200";
      iframe.style.margin = "10px 0";
      iframe.style.border = "none";
      iframe.style.borderRadius = "8px";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      link.parentNode.replaceChild(iframe, link);
      return;
    }

    let spotifyMatch = href.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
    if (spotifyMatch && spotifyMatch[1] && spotifyMatch[2]) {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://open.spotify.com/embed/' + spotifyMatch[1] + '/' + spotifyMatch[2];
      iframe.width = "100%";
      iframe.height = spotifyMatch[1] === 'track' ? "152" : "352";
      iframe.style.margin = "10px 0";
      iframe.style.border = "none";
      iframe.style.borderRadius = "12px";
      iframe.allow = "encrypted-media";
      link.parentNode.replaceChild(iframe, link);
      return;
    }

    let instaMatch = href.match(/instagram\.com\/(?:reels|reel|p)\/([a-zA-Z0-9_-]+)/);
    if (instaMatch && instaMatch[1]) {
      hasInstagram = true;
      const iframe = document.createElement('iframe');
      iframe.className = "instagram-media";
      iframe.src = 'https://www.instagram.com/p/' + instaMatch[1] + '/embed';
      iframe.width = "100%";
      iframe.height = "700";
      iframe.style.margin = "10px 0";
      iframe.style.border = "none";
      iframe.style.borderRadius = "8px";
      iframe.scrolling = "no";
      link.parentNode.replaceChild(iframe, link);
      return;
    }

    let streamableMatch = href.match(/streamable\.com\/([a-zA-Z0-9_-]+)/);
    if (streamableMatch && streamableMatch[1]) {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://streamable.com/e/' + streamableMatch[1];
      iframe.width = "100%";
      iframe.height = "360";
      iframe.style.margin = "10px 0";
      iframe.style.border = "none";
      iframe.style.borderRadius = "8px";
      iframe.allowFullscreen = true;
      link.parentNode.replaceChild(iframe, link);
      return;
    }
  });

  if (hasInstagram && !window.instgrm) {
    const script = document.createElement('script');
    script.src = "//www.instagram.com/embed.js";
    document.body.appendChild(script);
  } else if (hasInstagram && window.instgrm) {
    window.instgrm.Embeds.process();
  }
})();
</script>
`;

  allHtml += "</body></html>";

  fs.writeFileSync("entry.html", allHtml, "utf-8");
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Server çalışıyor: http://localhost:3000");
  console.log("📂 1. Tarayıcıda 'debe.html' dosyasını değil, http://localhost:3000/debe.html adresini açın.");
});

/*


node debe.js 
node server.js






*/