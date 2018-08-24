/**********************************
* 各種モジュールの読み込み
**********************************/
const mysql = require('mysql');
const fs = require('fs');

/**********************************
* メイン処理
**********************************/
// ファイルを読み込む
let loadFile = function () {
    return new Promise(function (resolve, reject) {
        // racelist.jsonをロード
        const data = fs.readFileSync(__dirname + '/odds.json', 'utf-8');
        // JSON形式に変換
        const json = JSON.parse(data);

        resolve(json);
    });
};


// DBにデータを挿入する
let insertToDB = function (data) {
    return new Promise(function (resolve, reject) {
        // DBに接続
        const connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'eVitch@0208',
            database : 'keiba'
        });

        // 挿入するデータセットを作成
        let data_set = [];
        
        data['race_data'].forEach(function(elem) {
                let array = [];

            array.push(data['race_id']);
            array.push(elem['number']);
            array.push(elem['name']);
            array.push(elem['win']);
            array.push(elem['place']);
            
            data_set.push(array);
        });

        console.log(data_set);

        // クエリを実行
        if (data_set.length != 0) { 
            const query = 'INSERT INTO odds (race_id, number, name, win, place) VALUES ?';
            connection.query(query, [data_set], (err, rows) => {
                if(err) throw err;
                console.log('Insert complete.');
            });
        } else {
            console.log('No data.');
        }

        // DBから切断
        connection.end((err) => {
            if (err) throw err;
        });

        resolve();
    });
}


// メイン処理を実行する
let main = function () {
    return new Promise(function (resolve, reject) {

    Promise.resolve()
        .then(function () {
            return loadFile();
        })
        .then(function (results) {
            return insertToDB(results);
        })
        .then(function (results) {
            // 完了
            resolve();
        })
        .catch(function (err) {
            // エラー通知
            reject(err);
        });

    });
};

main();