/**********************************
* 各種モジュールの読み込み
**********************************/
require('date-utils');
const cronJob = require('cron').CronJob;
const childProcess = require('child_process');
const fs = require('fs');

/**********************************
* メイン処理
**********************************/

// cronTimeの設定
const cronRaceInfoTime = '0 0 0 * * 6';
const cronOddsInfoTime = '0 0 0 * * 6';

// cronRaceInfoの設定
const cronRaceInfo = new cronJob({
    //実行したい日時 or crontab書式
    cronTime: cronRaceInfoTime

    //指定時に実行したい関数
    , onTick: function() {
        childProcess.execSync('node scrape_raceinfo.js');
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

// cronOddsInfoの設定
const cronOddsInfo = new cronJob({
    //実行したい日時 or crontab書式
    cronTime: cronOddsInfoTime

    //指定時に実行したい関数
    , onTick: function() {
        childProcess.execSync('node scrape_oddsinfo.js');
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
cronRaceInfo.start();
cronOddsInfo.start();

//ジョブ停止
//job.stop();