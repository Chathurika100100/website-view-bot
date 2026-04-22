const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

// Koyeb එකට සර්විස් එක පණ ගැන්වීමට අවශ්‍ය සරල වෙබ් සර්වර් එක
app.get('/', (req, res) => res.send('Surf Bot එක සාර්ථකව ක්‍රියාත්මක වේ!'));
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

async function runBot() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });

    const page = await browser.newPage();
    
    // බ්‍රවුසරය සැබෑ බ්‍රවුසරයක් ලෙස පෙන්වීමට User Agent එකක් සැකසීම
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 1. Cookies ලබා ගැනීම (Koyeb Environment Variables වලින්)
    const cookiesEnv = process.env.MY_COOKIES;
    
    if (cookiesEnv) {
        try {
            const cookies = JSON.parse(cookiesEnv);
            await page.setCookie(...cookies);
            console.log("Cookies සාර්ථකව ඇතුළත් කළා!");
        } catch (e) {
            console.error("Cookies JSON එකේ දෝෂයක් තියෙනවා.");
        }
    }

    // 2. ඔයා දුන්නු URL එකට පිවිසීම
    const targetUrl = 'https://exc.10khits.com/surf?id=804020&token=f5a9550d6876efcfb9046b2235d9abe4';
    
    try {
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log(`Bot එක වැඩ පටන් ගත්තා: ${targetUrl}`);
    } catch (err) {
        console.error("මුලින්ම පිටුවට යාමේදී දෝෂයක්: ", err.message);
    }

    // 3. හරියටම විනාඩි 15 කට වරක් Refresh කිරීම
    setInterval(async () => {
        try {
            console.log("විනාඩි 15ක් සම්පූර්ණයි. පිටුව Refresh වෙනවා... " + new Date().toLocaleTimeString());
            await page.reload({ waitUntil: 'networkidle2' });
        } catch (err) {
            console.error("Refresh කිරීමේදී දෝෂයක්: ", err.message);
        }
    }, 15 * 60 * 1000); // 15 minutes in milliseconds
}

runBot().catch(console.error);
