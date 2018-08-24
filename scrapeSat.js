const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    let url = 'http://race.netkeiba.com/?pid=odds&id=c201808030911&mode=top';

    // URLから数字のみ抽出
    let race_id = url.replace(/[^0-9]/g,'');

    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    // ヘッドレスブラウザの起動
    const page = await browser.newPage();

    // URLにアクセス
    await page.goto(url);

    // スクレイピング開始
    const scrapedData = await page.evaluate(() => {
        // データを格納する変数
        let list = [];
        let map = {};

        // 指定したセレクタの要素を抽出
        const html = document.querySelectorAll('table[id^="tblTansho"] td');
        html.forEach(function(elem, index) {
            switch(index % 6) {
                case 2:
                    // マップを初期化
                    map = {};

                    map['number'] = Number(elem.textContent);
                    break;
                // 馬名
                case 3:
                    map['name'] = elem.textContent;
                    break;
                // 単勝オッズ
                case 4:
                    map['win'] = Number(elem.textContent);
                    break;
                // 複勝オッズ
                case 5:
                    let text = elem.textContent.replace(/[^0-9^\.-]/g,'').split("-");
                    text = parseFloat(String(((Number(text[0]) + Number(text[1])) / 2).toFixed(1)));

                    map['place'] = Number(text);

                    // リストに追加
                    list.push(map);
                    break;
                default:
                    break;
			}
        });

        return list;
    });

    const data = {
        'race_id': race_id,
        'race_data': scrapedData
    }

    console.log(data);

    // ファイル保存
    fs.writeFileSync(__dirname + '/odds.json', JSON.stringify(data, null, '    '))

    // ヘッドレスブラウザの停止
    await browser.close();
})();