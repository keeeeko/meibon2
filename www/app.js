// This is a JavaScript file
//=======================================
// 定数
//=======================================
var DATABASE_NAME = "DbPicData";
var DATABASE_VER = "1.0";
var DATABASE_DISP_NAME = "DatabasePicData";
var DATABASE_SIZE = 200000;

//=======================================
// ロード完了時のイベントの追加
//=======================================
document.addEventListener ("deviceready", onDeviceReady, false);

//=======================================
// ロード完了時のイベント
//=======================================
function onDeviceReady () {
    // DBオープン
    var db = window.openDatabase(DATABASE_NAME, DATABASE_VER, DATABASE_DISP_NAME, DATABASE_SIZE);
    db.transaction(initialTables, errorCB, successInitialTables);
}
// SQL(DROP TABLE & CREATE TABLE)実行
function initialTables(tx){
    //このコメントを解除すると、起動するたびにテーブルが初期化されます。
    //tx.executeSql('DROP TABLE IF EXISTS PicDataTbl');
    tx.executeSql('CREATE TABLE IF NOT EXISTS PicDataTbl (title, body, pic)');
}
function successInitialTables(){
    //一覧を表示
    selectSql();
}

//=======================================
// カメラ起動ボタン押下時の処理
//=======================================
function snapPicture () {
    //カメラ起動
    navigator.camera.getPicture (onSuccess, onFail, 
        { quality: 50, destinationType: Camera.DestinationType.DATA_URL, targetWidth: 350, targetHeight: 300});
    
    //getPicture成功
    function onSuccess (imageData) {
        var image = document.getElementById ('pic-image');
        var pic = document.getElementById ('pic');
        
        var tmp = "data:image/jpeg;base64," + imageData;
        image.src = tmp;
        pic.value = tmp;
    }
    
    //getPicture失敗
    function onFail (message) {
        alert ('Error occured: ' + message);
    }
}

//=======================================
// 登録ボタン押下時の処理
//=======================================
function addList() {
    // DBオープン
    var db = window.openDatabase(DATABASE_NAME, DATABASE_VER, DATABASE_DISP_NAME, DATABASE_SIZE);
    db.transaction(insertQuery, errorCB, successInsertQuery);
}
// SQL(INSERT)実行
function insertQuery(tx) {
    var pic = $("#pic").val();
    var pic_title = $("#pic-title").val();
    var pic_body = $("#pic-body").val();
    tx.executeSql('INSERT INTO PicDataTbl (title, body, pic) VALUES (?, ?, ?)', [pic_title, pic_body, pic], selectSql);
}
// SQL(INSERT)成功
function successInsertQuery() {
    // 入力エリアの初期化
    $("#pic-image").attr("src", "img/blank.png");
    $("#pic").val("");
    $("#pic-title").val("");
    $("#pic-body").val("");
}

// ==========================================
// すべて削除ボタン押下時の処理
// ==========================================
function delList(){
    // DBオープン
    var db = window.openDatabase(DATABASE_NAME, DATABASE_VER, DATABASE_DISP_NAME, DATABASE_SIZE);
    db.transaction(deleteQuery, errorCB, successDeleteQuery);
}
// SQL(DELETE)実行
function deleteQuery(tx) {
    tx.executeSql('DELETE FROM PicDataTbl');
    // 一覧を初期化
    $("#pic-list").empty();
}
// SQL(DELETE)成功
function successDeleteQuery() {
    // 入力エリアの初期化
    $("#pic-image").attr("src", "img/blank.png");
    $("#pic").val("");
    $("#pic-title").val("");
    $("#pic-body").val("");
}

// ==========================================
// 一覧取得処理
// ==========================================
function selectSql(){
    // DBオープン
    var db = window.openDatabase(DATABASE_NAME, DATABASE_VER, DATABASE_DISP_NAME, DATABASE_SIZE);
    db.transaction(selectQuery, errorCB, successCB);
}
// SQL(SELECT)実行
function selectQuery(tx) {
    tx.executeSql('SELECT * FROM PicDataTbl', [], selectSuccess);
}
// SQL(SELECT)成功
function selectSuccess(tx, results) {
    // 一覧を初期化
    $("#pic-list").empty();
    
    // 一覧を描画
    var len = results.rows.length;
//    alert("データ件数" + len);
    if (len>0){
        for (var i=0; i<len; i++) {
        var img = "<img src='" + results.rows.item(i).pic + "'>";
        var title = results.rows.item(i).title;
        var body = results.rows.item(i).body;
        $("#pic-list").append("<li><br/><h3>"  + "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" + title + "</h3>" + img + "<p>"  + "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"  + body + "</p><br/><hr/></li>");
       
        }
    }else{
        $("#pic-list").append("<li><br/><h3>名前</h3><img style=\"width:250px; height:300px; \" border=\"5\" src=\"http://www.kana-hpga.or.jp/img/SellBook/NoImage.png\"></><p>特徴</p><br><hr/></li>");
    }
//    for (var i=0; i<len; i++) {
//        var img = "<img src='" + results.rows.item(i).pic + "'>";
//        var title = results.rows.item(i).title;
//        var body = results.rows.item(i).body;
//        $("#pic-list").append("<li><br/><h3>" + title + "</h3>" + img + "<p>" + body + "</p><br/><hr/></li>");
//       
//    }
//        $("pic-list").append("<li><br/><h3>" + 名前 + "</h3>" + "<img src=http://www.kana-hpga.or.jp/img/SellBook/NoImage.png>" + "<p>" + 特徴 + "</p><br><hr/></li>");
}

// ==========================================
// 共通処理
// ==========================================
//SQL成功
function successCB() {
}
//SQL失敗
function errorCB(err) {
    alert("エラー発生: "+err.code);
}


