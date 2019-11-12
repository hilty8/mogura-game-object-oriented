const STATUS = defineEnum({
  HIDE:  0,
  SHOW:  1,
  PRESS: 2
})

const MOGURA_TYPE = defineEnum({
  NORMAL: {
    value: 0,
    point: 1,
    durationTime: 1000,
    imgShow: "images/モグ2.png",
    imgPress: "images/モグ1.png"
  },
  SUNGLASSES: {
    value: 1,
    point: 2,
    durationTime: 850,
    imgShow: "images/モグ3.png",
    imgPress: "images/モグ4.png"
  },
  GOBURIN: {
    value: 2,
    point: 3,
    durationTime: 700,
    imgShow: "images/ゴブ1.png",
    imgPress: "images/ゴブ2.png"
  }
})

// ゲームのスコアを加算する
// 参考：「開眼！JavaScript」101p
let plusScore = function(){
  let score = 0;
  return function(){
    return ++score;
  };
}();

function GameController(){
  let timeLimit = 30;

  // モグラオブジェクトを初期化
  const moguras = document.querySelectorAll('.mogura');
  moguras.forEach((element) => { InitMogura(element); })

  function start(){
    // 顔を出す処理
    let interval = setInterval(() => {
      let random = Math.floor(Math.random() * 9);
      moguras[random].show();
    }, 300);
  
    // 残り時間
    let timeLimitInterval = setInterval(() => {
      document.getElementById('remainingTime').textContent = '残り時間 : ' + --timeLimit;
      if(timeLimit == 0){
        clearTimeout(interval);
        clearTimeout(timeLimitInterval);
        // 関数実行時に +1 されてしまうので -1
        const score = plusScore() - 1;
        alert('ゲーム終了 得点 : ' + score);        
      }
    }, 1000)
  }
  start();
}
GameController();


function InitMogura(image){
  // 初期：隠れた状態
  image.status = STATUS.HIDE;

  image.durationTime = 1000;

  // 通常モグラ、グラサン、ゴブリンから選択
  image.moguraType = MOGURA_TYPE.NORMAL.value;

  // image.moguraType を参照し、得点、画像を変更
  image.setProperty = function(){
    // ポイント設定
    image.point = MOGURA_TYPE.getByValue('value', image.moguraType).point;
    // 顔を出す時間
    image.durationTime = MOGURA_TYPE.getByValue('value', image.moguraType).durationTime;
    // プロパティに画像を追加 -- imgShow(顔を出す), imgPress(叩かれ顔)
    image.imgPress = MOGURA_TYPE.getByValue('value', image.moguraType).imgPress;
    image.imgShow  = MOGURA_TYPE.getByValue('value', image.moguraType).imgShow;
  }
  image.setProperty();

  // 叩く
  image.onclick = function(){
    for(i=0; i<this.point; i++){
      document.getElementById('gamePoint').textContent = '得点 : ' + plusScore();
    }
    this.status = STATUS.PRESS;
    this.src = image.imgPress;
    clearTimeout(this.autoHide);
    setTimeout((image) => { image.hide() }, 500, this);
  }

  image.hide = function(){
    this.status = STATUS.HIDE;
    this.src = "";
  }

  // 顔を出す
  image.show = function(){
    if(image.status != STATUS.HIDE){
      return false;
    }
    this.shuffleType();
    this.status = STATUS.SHOW;
    this.src = image.imgShow;
    // 一定時間後に隠れる
    this.autoHide = setTimeout((image) => { image.hide(); }, this.durationTime, this) 
    return true;
  }

  // 普通モグラ、グラサン、ゴブリン、をランダムに入れ替える
  // -- 変更するプロパティ -> type, imgShow, imgHide
  image.shuffleType = function(){
    let random = Math.floor(Math.random() * 10);
    let moguraType;
    if(random > 8){
      moguraType = 2;
    } else if(random > 6) {
      moguraType = 1;
    } else {
      moguraType = 0;
    }
    image.moguraType = moguraType;
    image.setProperty();
  }
}
