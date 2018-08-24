const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    // ファイル読み込み
    const data = fs.readFileSync(__dirname + '/race.json', 'utf-8');
    // JSON形式に変換
    const json = JSON.parse(data);

    let odds = [];
    let counter = 0;

    for(key in json) {
        const url = json[key];

        // URLから数字のみ抽出
        const race_id = url.replace(/[^0-9]/g,'');

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

            let flag = true;

            // 指定したセレクタの要素を抽出
            const html = document.querySelectorAll('table[id^="tblTansho"] td');
            html.forEach(function(elem, index) {
                switch(index % 6) {
                    // 馬番
                    case 2:
                        // マップを初期化
                        map = {};

                        //map['race_id'] = race_id;

                        map['number'] = Number(elem.textContent);
                        break;
                    // 馬名
                    case 3:
                        map['name'] = elem.textContent;
                        break;
                    // 単勝オッズ
                    case 4:
                        if(elem.textContent != '取消') {
                            map['win'] = Number(elem.textContent);
                        } else {
                            flag = false;
                        }
                        
                        break;
                    // 複勝オッズ
                    case 5:
                        let text = elem.textContent.replace(/[^0-9^\.-]/g,'').split("-");
                        text = parseFloat(String(((Number(text[0]) + Number(text[1])) / 2).toFixed(1)));

                        map['place'] = Number(text);

                        // リストに追加
                        if(flag) {
                            list.push(map);
                        }

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

        odds.push(data);

        if(counter != 0) {
            console.log(odds);

            // ファイル保存
            fs.writeFileSync(__dirname + '/odds.json', JSON.stringify(odds, null, '    '))
        }

        counter++;

        // ヘッドレスブラウザの停止
        await browser.close();
    }
})();