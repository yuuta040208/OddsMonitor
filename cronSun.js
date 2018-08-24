/**********************************
* 各種モジュールの読み込み
**********************************/
require('date-utils');
const cronJob = require('cron').CronJob;
const childProcess = require('child_process');
const  fs = require('fs');

/**********************************
* メイン処理
**********************************/

// cronの設定
const cronTime_0 = "0 */30 * * * *";

const job_0 = new cronJob({
    //実行したい日時 or crontab書式
    cronTime: cronTime_0

    //指定時に実行したい関数
    , onTick: function() {
        // 実行するスクリプトを指定
        const scrape = "scrapeSun.js";
        const scrape_process = childProcess.spawn('node', [scrape], { stdio: 'inherit' });

        // 現在時刻を取得
        const date = new Date();
        const now = date.toFormat('YYYY/MM/DD HH24:MI:SS');

        console.log(scrape + ' (' + now + ')');
        console.log('==================================================');

        // スクリプト終了時の処理
        scrape_process.on('exit', function (code) {
            // 実行するスクリプトを指定
            const insert = "insert.js";
            const insert_process = childProcess.spawn('node', [insert], { stdio: 'inherit' });

            // 現在時刻を取得
            const date = new Date()
            const now = date.toFormat('YYYY/MM/DD HH24:MI:SS');

            console.log(insert + ' (' + now + ')');
            console.log('==================================================');

            // スクリプト終了時の処理
            insert_process.on('exit', function (code) {
                // 実行するスクリプトを指定
                const embulk_process = childProcess.exec('embulk run config.yml');

                // 現在時刻を取得
                const date = new Date()
                const now = date.toFormat('YYYY/MM/DD HH24:MI:SS');

                console.log('embulk run config.yml (' + now + ')');
                console.log('==================================================');
            });

            // スクリプトエラー発生時の処理
            insert_process.on('error', function (err) {
                console.error(err);
                process.exit(1);
            });
        });

        // スクリプトエラー発生時の処理
        scrape_process.on('error', function (err) {
            console.error(err);
            process.exit(1);
        });
    }

    //ジョブの完了または停止時に実行する関数 
    , onComplete: function() {
        console.log('onComplete!')
    }

    // コンストラクタを終する前にジョブを開始するかどうか
    , start: false

    //タイムゾーン
    , timeZone: "Asia/Tokyo"
})


//ジョブ開始
job_0.start();


//ジョブ停止
//job.stop();