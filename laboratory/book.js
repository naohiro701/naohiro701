//Google apps script 
function setBookInfo() {
  sheet = SpreadsheetApp.getActiveSheet(); // シートを取得
  insertRow = sheet.getActiveCell().getRow(); // 行を取得
  isbn = sheet.getActiveCell().getValue(); // 変更した部分を取得. 

  // Google Books API
  response = UrlFetchApp.fetch(
    "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn + "&country=JP"
  );
  
  //today
  var date = new Date();
  date = Utilities.formatDate(date, "Asia/Tokyo", "yyyy/MM/dd");

  data = JSON.parse(response.getContentText()); //JSON形式のレスポンスをオブジェクトとしてパース
  bookInfo = data.items[0].volumeInfo; //本の情報を取得

  var id = sheet.getRange(insertRow - 1, 1).getValues() + 1; //シールの番号
  
  sheet.getRange(insertRow, 1).setValue(id); //シールの番号
  sheet.getRange(insertRow, 3).setValue(date); //日時
  sheet.getRange(insertRow, 6).setValue(bookInfo.title); //タイトル
  sheet.getRange(insertRow, 7).setValue(bookInfo.authors.join()); // 著者
  sheet.getRange(insertRow, 11).setValue(bookInfo.publisher); //出版社
  sheet.getRange(insertRow, 13).setValue(bookInfo.publishedDate); //発行日
  sheet.getRange(insertRow, 14).setValue('=IMAGE("' + bookInfo.imageLinks.thumbnail + '")'); // サムネイル

  //以下参考までに
  //sheet.getRange(insertRow,).setValue(bookInfo.categories.join()); //カテゴリ
  //sheet.getRange(insertRow,).setValue(bookInfo.canonicalVolumeLink); // リンク
}

function onEdit(e) {
  // 編集カラムが2列目(ISBNの行)であればsetBookInfo関数を呼び出す
  // ほかのシートは管理者アカウントからでしか変更できません．
  // ISBNの行は数字しか入力できません．
  if (e.range.getColumn() == 2) {
    setBookInfo();
  }
}
