/* jshint curly:true, debug:true */
/* globals $, firebase */

/**
 * -------------------
 * ボタンを押したらページを変更させる関連の処理
 * -------------------
 */

//index-htmlのアニメーションを動かす処理
 document.addEventListener('DOMContentLoaded', function () {
  const ta = new TextAnimation('.animate-title');
  ta.animate();
});

// text-animation.jsに以下のコードをカット＆ペースト
// してファイル分割をしましょう。
class TextAnimation {
  constructor(el) {
      this.DOM = {};
      this.DOM.el = document.querySelector(el);
      this.chars = this.DOM.el.innerHTML.trim().split("");
      this.DOM.el.innerHTML = this._splitText();
  }
  _splitText() {
      return this.chars.reduce((acc, curr) => {
          curr = curr.replace(/\s+/, '&nbsp;');
          return `${acc}<span class="char">${curr}</span>`;
      }, "");
  }
  animate() {
      this.DOM.el.classList.toggle('inview');
  }
}
class TweenTextAnimation extends TextAnimation {
  constructor(el) {
      super(el);
      this.DOM.chars = this.DOM.el.querySelectorAll('.char');
  }
  
  animate() {
      this.DOM.el.classList.add('inview');
      this.DOM.chars.forEach((c, i) => {
          TweenMax.to(c, .6, {
              ease: Back.easeOut,
              delay: i * .05,
              startAt: { y: '-50%', opacity: 0},
              y: '0%',
              opacity: 1
          });
      });
  }
}


//ヘッダーハンバーガーメニュー
$(".nav-menu").on("click", function () {
  document.querySelector('body').classList.toggle('menu-open');
  $(".nav-item-hidden").toggle(500);
});

//index-htmlへ
$(".index-btn").click(function () {
  showView("index-html", "signup-html", "index-html");
});

//ログインページへ
$(".login-btn").click(function () {
  showView("login-html", "index-html", "signup-html");
});

//新規登録ページへ
$(".signup-btn").click(function () {
  showView("signup-html", "index-html", "login-html");
});

//top-htmlへ
$(".top-btn").click(function () {
  showView(
    "top-html",
    "user-html",
    "my-profile-html",
    "profile-edit-html",
    "user-profile-html",
    "post-html"
  );
});

//user-htmlへ
$(".user-btn").click(function () {
  showView(
    "user-html",
    "top-html",
    "my-profile-html",
    "profile-edit-html",
    "user-profile-html",
    "post-html"
  );
});

//my-profile-htmlへ
$(".my-profile-btn").click(function () {
  showView(
    "my-profile-html",
    "top-html",
    "user-html",
    "profile-edit-html",
    "user-profile-html",
    "post-html"
  );
});

//post-htmlへ
$(".post-btn").click(function () {
  showView(
    "post-html",
    "top-html",
    "user-html",
    "my-profile-html",
    "profile-edit-html",
    "user-profile-html"
  );
});

//my-porofile-htmlへ
$(".my-profile-btn").click(function () {
  showView(
    "my-profile-html",
    "top-html",
    "user-html",
    "profile-edit-html",
    "user-profile-html",
    "post-html"
  );
});

$(".profile-edit-btn").click(function () {
  showView(
    "profile-edit-html",
    "top-html",
    "user-html",
    "user-profile-html",
    "post-html",
    "my-profile-html"
  );
});

/**
 * -------------------
 * 書籍一覧画面関連の関数
 * -------------------
 */

// 書籍の表紙画像をダウンロードする
const downloadPostImage = (postImageLocation) =>
  firebase
    .storage()
    .ref(postImageLocation)
    .getDownloadURL() // book-images/abcdef のようなパスから画像のダウンロードURLを取得
    .catch((error) => {
      console.error("写真のダウンロードに失敗:", error);
    });

// 書籍の表紙画像を表示する
const displayPostImage = ($divTag, url) => {
  $divTag.find(".post-item__image").attr({
    src: url,
  });
};

// Realtime Database の posts から書籍を削除する
const deleteBook = (postId) => {
  firebase
    .database()
    .ref(`posts/${postId}`)
    .remove()
    .then(function () {
      console.log("削除しました");
    });
};

const deletePost = (postId) => {
  firebase
    .database()
    .ref(`posts/${postId}`)
    .remove()
    .then(function () {
      console.log("削除しました");
    });
  
    showView(
      "top-html",
      "user-html",
      "my-profile-html",
      "profile-edit-html",
      "user-profile-html",
      "post-html"
    );
}

// 書籍の表示用のdiv（jQueryオブジェクト）を作って返す
const createPostDiv = (postId, postData) => {
  // HTML内のテンプレートからコピーを作成する
  const $divTag = $("#post-template > .post-item").clone();

  // 書籍タイトルを表示する
  $divTag.find(".post-item__title").text(postData.postTitle);

  $divTag.find(".top-user-name").text(postData.postName);

  $divTag.find(".introduction-item").text(postData.postDescription);

  // 書籍の表紙画像をダウンロードして表示する
  downloadPostImage(postData.postImageLocation).then((url) => {
    displayPostImage($divTag, url);
  });

  // id属性をセット
  $divTag.attr("id", `book-id-${postId}`);
  $divTag
    .find(".post-item__image-wrapper > a")
    .attr("id", `user-btn-${postId}`);
  $divTag
    .find(".post-item__image-wrapper > a")
    .attr("class", postData.postUserId);


  //自分の投稿ならmy-profileページに表示させる
  const userClass = $divTag.find(".post-item__image-wrapper > a").attr("class");

  //自分の投稿なら削除ボタンを表示させる
  firebase.auth().onAuthStateChanged((user) => {
    if(userClass === user.uid) {
      $divTag.find(".post-item__delete-wrapper").removeClass("hide");
    }
  });


  //自分の投稿ならmy-profileページに表示させる
  firebase.auth().onAuthStateChanged((user) => {
    if(userClass === user.uid) {

        const $divTag = $("#my-post > .post-item").clone();
      
        // 投稿のタイトルを表示する
        $divTag.find(".post-item__title").text(postData.postTitle);
      
        $divTag.find(".top-user-name").text(postData.postName);
      
        $divTag.find(".introduction-item").text(postData.postDescription);
      
        // 書籍の表紙画像をダウンロードして表示する
        downloadPostImage(postData.postImageLocation).then((url) => {
          displayPostImage($divTag, url);
        });
        // 削除ボタンのイベントハンドラを登録
        const $deleteButton = $divTag.find(".post-item__delete");
        $deleteButton.on("click", () => {
          deletePost(postId); //my-profileページでの削除ボタンの関数
        });

       $divTag.appendTo('#my-post-list');
    }
  });


  // 削除ボタンのイベントハンドラを登録
  const $deleteButton = $divTag.find(".post-item__delete");
  $deleteButton.on("click", () => {
    deleteBook(postId); //投稿ページでの削除ボタンの関数
  });

  //
  let a = $divTag.find(".post-item__image-wrapper > a").attr("class");

  //ユーザーIDに合わせて各ユーザーのプロフィール画面に飛ぶ

  $divTag.find(`.${a}`).on("click", () => {
    // console.log(`${a}クリックされました`);
    // ログイン状態の変化を監視する
    firebase.auth().onAuthStateChanged((user) => {
      const profileRef = firebase
        .database()
        .ref(`profiles/${a}`)
        .orderByChild(`${a}`);
      // 過去に登録したイベントハンドラを削除
      profileRef.off("child_removed");
      profileRef.off("child_added");

      // console.log(profileRef);
      // posts の child_addedイベントハンドラを登録
      // （データベースに書籍が追加保存されたときの処理）
      profileRef.on("child_added", (postSnapshot) => {
        const profileId = postSnapshot.key;
        const profileData = postSnapshot.val();
        //ユーザーのプロフィール画面で投稿者のUIDに合わせて表示
        // 自分のプロフィールで名前を表示する
        $(".user-profile-name").text(profileData.profileName);

        $(".user-profile-twitter").text(profileData.profileTwitter); //twitterIDを表示

        //自己紹介を表示
        $(".user-profile-introduction").text(profileData.profileIntroduction);

        $(".introduction-post-text").text(postData.postDescription);

        // プロフィールの表紙画面のURLをダウンロード
        downloadPostImage(profileData.ProfileImageLocation).then((url) => {
          $(".profile-img-top").attr({
            src: url, //my-profileページに表示させる
          });
        });

        //入っているファンクラブを表示
        let checklist = "";
        for (let i = 0; i < profileData.profileCheck.length; i++) {
          // console.log(profileData.profileCheck[i]);
          checklist += "<li>" + profileData.profileCheck[i] + "</li>";
        }
        document.querySelector(".user-profile-fanclub").innerHTML = checklist;
      });
    });
  });

  //Userの投稿サムネイルをクリックしたら
  $divTag.find(`#user-btn-${postId}`).on("click", () => {
    // alert('クリックされました');
    showView(
      "user-profile-html",
      "profile-edit-html",
      "top-html",
      "user-html",
      "post-html",
      "my-profile-html"
    );

    // 書籍の表紙画像をダウンロードして表示する
    downloadPostImage(postData.postImageLocation).then((url) => {
      $(".card-img-top").attr({
        src: url, //user-profileページに表示させる
      });
    });
  });

  $(".card-img-top").attr({
    src: "image/muji.png",
  });

  return $divTag;
};



// プロフィールの表示用のdivを作って返す
//TODO
const createProfileDiv = (postId, postData) => {
  // HTML内のテンプレートからコピーを作成する
  const $divTag = $(".simeji");

  // 自分のプロフィールで名前を表示する
  $(".card-name-title").text(postData.profileName);

  $(".twitter-name").text(postData.profileTwitter); //twitterIDを表示

  //自己紹介を表示
  $(".my-profile-introduction").text(postData.profileIntroduction);

  

  // プロフィールの表紙画面のURLをダウンロード
  downloadPostImage(postData.ProfileImageLocation).then((url) => {
    $(".profile-img-top").attr({
      src: url, //my-profileページに表示させる
    });
  });


  //入っているファンクラブを表示
  let checklist = "";
  for (let i = 0; i < postData.profileCheck.length; i++) {
    checklist += "<li>" + postData.profileCheck[i] + "</li>";
  }

  document.querySelector(".my-profile-fanclub").innerHTML = checklist;

  $(".profile-img-top").attr({
    src: "image/muji.png",
  });

  return $divTag;
};

// 投稿一覧画面内の書籍データをクリア
const resetPostshelfView = () => {
  // $("#book-list").empty();
  $("#book-kimura").empty();
  $("#book-TOKIO").empty();
  $("#book-kinkikids").empty();
  $("#book-v6").empty();
  $("#book-arasi").empty();
  $("#book-KAT-TUN").empty();
  $("#book-news").empty();
  $("#book-kanjani").empty();
  $("#book-jump").empty();
  $("#book-kisMy").empty();
  $("#book-sexy-zone").empty();
  $("#book-ABC").empty();
  $("#book-west").empty();
  $("#book-kinpri").empty();
  $("#book-six-tones").empty();
  $("#book-Snowman").empty();
  $("#book-jr").empty();
};

// 投稿一覧画面に書籍データを表示する
const addPost = (postId, postData) => {
  const $divTag = createPostDiv(postId, postData);

  //セレクトボックスの値によって表示場所を変える
  if (postData.postSelect === "木村拓哉") {
    $divTag.appendTo("#book-kimura");
  } else if (postData.postSelect === "TOKIO") {
    $divTag.appendTo("#book-TOKIO");
  } else if (postData.postSelect === "KinKiKids") {
    $divTag.appendTo("#book-kinkikids");
  } else if (postData.postSelect === "V6") {
    $divTag.appendTo("#book-v6");
  } else if (postData.postSelect === "嵐") {
    $divTag.appendTo("#book-arasi");
  } else if (postData.postSelect === "KAT-TUN") {
    $divTag.appendTo("#book-KAT-TUN");
  } else if (postData.postSelect === "NEWS") {
    $divTag.appendTo("#book-news");
  } else if (postData.postSelect === "関ジャニ∞") {
    $divTag.appendTo("#book-kanjani");
  } else if (postData.postSelect === "Hey!Say!Jump") {
    $divTag.appendTo("#book-jump");
  } else if (postData.postSelect === "Kis-My-Ft2") {
    $divTag.appendTo("#book-kisMy");
  } else if (postData.postSelect === "SexyZone") {
    $divTag.appendTo("#book-sexy-zone");
  } else if (postData.postSelect === "A.B.C-Z") {
    $divTag.appendTo("#book-ABC");
  } else if (postData.postSelect === "ジャニーズWEST") {
    $divTag.appendTo("#book-west");
  } else if (postData.postSelect === "King&Prince") {
    $divTag.appendTo("#book-kinpri");
  } else if (postData.postSelect === "SixTONES") {
    $divTag.appendTo("#book-six-tones");
  } else if (postData.postSelect === "SnowMan") {
    $divTag.appendTo("#book-Snowman");
  } else if (postData.postSelect === "SnowMan") {
    $divTag.appendTo("#book-Snowman");
  } else if (postData.postSelect === "ジャニーズジュニア情報局") {
    $divTag.appendTo("#book-jr");
  }
  // $divTag.appendTo("#book-list");
};

//ユーザーのプロフィール画面にデータを表示
const addProfile = (profileId, profileData) => {
  const $divTag = createProfileDiv(profileId, profileData);

  $divTag.appendTo("#my-profile-icon");
};



// 書籍一覧画面の初期化、イベントハンドラ登録処理
const loadPostshelfView = () => {
  resetPostshelfView();

  // 書籍データを取得
  const postsRef = firebase.database().ref("posts").orderByChild("createdAt");

  firebase.auth().onAuthStateChanged((user) => {
    const profileRef = firebase
      .database()
      .ref(`profiles/${user.uid}`)
      .orderByChild(`${user.uid}/createdAt`);
    // 過去に登録したイベントハンドラを削除
    profileRef.off("child_removed");
    profileRef.off("child_added");

    // posts の child_removedイベントハンドラを登録
    // （データベースから書籍が削除されたときの処理）
    profileRef.on("child_removed", (postSnapshot) => {
      const profileId = postSnapshot.key;
      const $post = $(`#book-id-${profileId}`);

      // TODO: 書籍一覧画面から該当の書籍データを削除する
      // $("#book-list").find($post).fadeOut();
      $("#book-arasi").find($post).fadeOut();
      $("#book-jr").find($post).fadeOut();
      $("#book-kanjani").find($post).fadeOut();
      $("#book-kinpri").find($post).fadeOut();
      $("#book-jump").find($post).fadeOut();
      $("#book-kinkikids").find($post).fadeOut();
      $("#book-Snowman").find($post).fadeOut();
      $("#book-news").find($post).fadeOut();
      $("#book-west").find($post).fadeOut();
      $("#book-v6").find($post).fadeOut();
      $("#book-six-tones").find($post).fadeOut();
      $("#book-KAT-TUN").find($post).fadeOut();
      $("#book-TOKIO").find($post).fadeOut();
      $("#book-ABC").find($post).fadeOut();
      $("#book-kimura").find($post).fadeOut();
    });

    // posts の child_addedイベントハンドラを登録
    // （データベースに書籍が追加保存されたときの処理）
    profileRef.on("child_added", (postSnapshot) => {
      const profileId = postSnapshot.key;
      const profileData = postSnapshot.val();

      // 書籍一覧画面に書籍データを表示する
      addProfile(profileId, profileData);
    });
  });

  // 過去に登録したイベントハンドラを削除
  postsRef.off("child_removed");
  postsRef.off("child_added");

  // posts の child_removedイベントハンドラを登録
  // （データベースから書籍が削除されたときの処理）
  postsRef.on("child_removed", (postSnapshot) => {
    const postId = postSnapshot.key;
    const $post = $(`#book-id-${postId}`);


    // TODO: 書籍一覧画面から該当の書籍データを削除する
    // $("#book-list").find($post).fadeOut();
    $("#book-arasi").find($post).fadeOut();
    $("#book-jr").find($post).fadeOut();
    $("#book-kanjani").find($post).fadeOut();
    $("#book-kinpri").find($post).fadeOut();
    $("#book-jump").find($post).fadeOut();
    $("#book-kinkikids").find($post).fadeOut();
    $("#book-Snowman").find($post).fadeOut();
    $("#book-news").find($post).fadeOut();
    $("#book-west").find($post).fadeOut();
    $("#book-v6").find($post).fadeOut();
    $("#book-six-tones").find($post).fadeOut();
    $("#book-KAT-TUN").find($post).fadeOut();
    $("#book-TOKIO").find($post).fadeOut();
    $("#book-ABC").find($post).fadeOut();
    $("#book-kimura").find($post).fadeOut();
  });


  firebase.auth().onAuthStateChanged((user) => {
      // posts の child_addedイベントハンドラを登録
    // （データベースに書籍が追加保存されたときの処理）
    postsRef.on("child_added", (postSnapshot) => {
      const postId = postSnapshot.key;
      const postData = postSnapshot.val();
      // 書籍一覧画面に書籍データを表示する
      addPost(postId, postData);
    });

  });
};

/**
 * ----------------------
 * すべての画面共通で使う関数
 * ----------------------
 */

// ビュー（画面）を変更する
const showView = (
  id,
  hide,
  hide2,
  hide3,
  hide4,
  hide5,
  hide6,
  hide7,
  hide8,
  hide9
) => {
  $(`#${hide9}`).hide();
  $(`#${hide8}`).hide();
  $(`#${hide7}`).hide();
  $(`#${hide6}`).hide();
  $(`#${hide5}`).hide();
  $(`#${hide4}`).hide();
  $(`#${hide3}`).hide();
  $(`#${hide2}`).hide();
  $(`#${hide}`).hide();
  $(`#${id}`).fadeIn();

  if (id === "top-html") {
    loadPostshelfView();
  }
};

/**
 * -------------------------
 * ログイン・ログアウト関連の関数
 * -------------------------
 */

// ログインフォームを初期状態に戻す
const resetLoginForm = () => {
  $("#login__help").hide();
  $("#login__submit-button").prop("disabled", false).text("ログイン");
};

// ログインした直後に呼ばれる
const onLogin = () => {
  console.log("ログイン完了");

  // 書籍一覧画面を表示
  showView(
    "top-html",
    "index-html",
    "login-html",
    "signup-html",
    "post-html",
    "user-html",
    "my-profile-html",
    "profile-edit-html",
    "user-profile-html"
  ); //画面削除
};

// ログアウトした直後に呼ばれる
const onLogout = () => {
  const postsRef = firebase.database().ref("posts");

  // 過去に登録したイベントハンドラを削除
  postsRef.off("child_removed");
  postsRef.off("child_added");

  console.log("ログアウトしました");

  showView(
    "index-html",
    "my-profile-html",
    "top-html",
    "user-html",
    "profile-edit-html",
    "user-profile-html",
    "post-html"
  );
};

/**
 * ------------------
 * イベントハンドラの登録
 * ------------------
 */

// ログイン状態の変化を監視する
firebase.auth().onAuthStateChanged((user) => {
  // ログイン状態が変化した
  if (user) {
    // // ログイン済
    onLogin();
  } else {
    // 未ログイン
    onLogout();
  }
});

$("#signup-form").on("submit", (e) => {
  e.preventDefault();

  //プロフィール情報を表示取得させる
  function profileRegistration() {
    //新規登録のフォームからValをとってくる
    const profileName = $("#user-name").val(); //user-nameを取得
    const profileTwitter = $("#twitter-name").val(); //TwitterIdを取得
    const profileIntroduction = $("#profile-introduction").val(); //新規登録画面から自己紹介を取得

    const $profileImage = $("#user_image_name");
    const { files } = $profileImage[0];

    //チェックボックスの値を取得
    //profileCheckはチェックボックスの配列が入る
    const profileCheck = [];
    const color2 = document.getElementsByName("fanItem");

    for (let i = 0; i < color2.length; i++) {
      if (color2[i].checked) {
        //(color2[i].checked === true)と同じ
        profileCheck.push(color2[i].value);
      }
    }

    const file = files[0];
    const filename = file.name; // 画像ファイル名
    const ProfileImageLocation = `profile-images/${filename}`; // 画像ファイルのアップロード先

    // ログイン状態の変化を監視する
    firebase.auth().onAuthStateChanged((user) => {
      // ログイン状態が変化した
      if (user) {
        // // ログイン済
        //プロフィールデータを保存する
        firebase
          .storage()
          .ref(ProfileImageLocation)
          .put(file) //Storageへファイルアップロードを実行
          .then(() => {
            //Storageへのアップロードに成功したら、Realtime Databaseにプロフィールデータを保存する
            const profileData = {
              profileName,
              profileTwitter,
              profileIntroduction,
              profileCheck,
              ProfileImageLocation,
              createdAt: firebase.database.ServerValue.TIMESTAMP,
            };
            return firebase
              .database()
              .ref(`profiles/${user.uid}`)
              .push(profileData);
          })
          .then(() => {})
          .catch((error) => {
            // 失敗したとき
            console.error("エラー", error);
          });
      } else {
        // 未ログイン
      }
    });
  }

  profileRegistration();

  //TODO
  //新規登録を試みる
  function signup() {
    let email = $("#email").val();
    let password = $("#password").val();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log("ユーザー作成完了");
        alert("ユーザー作成完了");
      })
      .catch((error) => {
        console.log("ユーザー作成失敗", error);
        alert("ユーザー作成失敗");
      });
  }

  signup();

});

const signInWithGoogle = () => {
  var provider = new firebase.auth.TwitterAuthProvider();
  console.log('クリックされました');
  firebase
  .auth()
  .signInWithPopup(provider)
  .then((result) => {
   window.location.assign('./profile');
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    console.log(error);
  });
}

$(".signInWithTwitter").on("click",() => {
  signInWithGoogle();
})

// ログインフォームが送信されたらログインする
$("#login-form").on("submit", (e) => {
  e.preventDefault();

  const $loginButton = $("#login__submit-button");
  $loginButton.text("送信中…");

  const email = $("#login-email").val();
  const password = $("#login-password").val();

  // ログインを試みる
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      // ログインに成功したときの処理
      console.log("ログインしました。");

      // ログインフォームを初期状態に戻す
      resetLoginForm();
    })
    .catch((error) => {
      // ログインに失敗したときの処理
      console.error("ログインエラー", error);

      $("#login__help").text("ログインに失敗しました。").show();

      // ログインボタンを元に戻す
      $loginButton.text("ログイン");
    });
});

// ログアウトボタンが押されたらログアウトする
$(".logout-button").on("click", () => {
  firebase
    .auth()
    .signOut()
    .catch((error) => {
      console.error("ログアウトに失敗:", error);
    });
});

/**
 * -------------------------
 * 投稿情報追加関連の処理
 * -------------------------
 */

// 書籍の登録モーダルを初期状態に戻す
const resetAddPostModal = () => {
  $("#post-form")[0].reset();
  $("#add-book-image-label").text("");
  $("#submit_add_book").prop("disabled", false).text("投稿");

  showView("top-html", "post-html", "profile-edit-html");
};

// 選択した表紙画像の、ファイル名を表示する
$("#add-book-image").on("change", (e) => {
  const input = e.target;
  const $label = $("#add-book-image-label");
  const file = input.files[0];

  if (file != null) {
    $label.text(file.name);
  } else {
    $label.text("ファイルを選択");
  }
});

// プロフィールの登録手順
$("#edit-form").on("submit", (e) => {
  e.preventDefault();

  //書籍の登録ボタンを押せないようにする
  $("#submit-edit").prop("disabled", true).text("送信中・・・");

  const profileName = $("#edit-name").val();
  const profileTwitter = $("#edit-twitter").val();
  const profileIntroduction = $("#edit-introduction").val();
  //チェックボックスの値を取得
  //profileCheckはチェックボックスの配列が入る
  const profileCheck = [];
  const color2 = document.getElementsByName("fanItem");

  for (let i = 0; i < color2.length; i++) {
    if (color2[i].checked) {
      //(color2[i].checked === true)と同じ
      profileCheck.push(color2[i].value);
    }
  }

  const $profileImage = $("#edit-image");
  const { files } = $profileImage[0];


  const file = files[0];
  const filename = file.name; // 画像ファイル名
  const ProfileImageLocation = `profile-images/${filename}`; // 画像ファイルのアップロード先

  // ログイン状態の変化を監視する
  firebase.auth().onAuthStateChanged((user) => {
    // ログイン状態が変化した
    if (user) {
      // // ログイン済
      // console.log(user.uid);
      //プロフィールデータを保存する
      firebase
        .storage()
        .ref(ProfileImageLocation)
        .put(file) //Storageへファイルアップロードを実行
        .then(() => {
          //Storageへのアップロードに成功したら、Realtime Databaseにプロフィールデータを保存する
          const profileData = {
            profileName,
            profileTwitter,
            profileCheck,
            profileIntroduction,
            ProfileImageLocation,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
          };
          return firebase
            .database()
            .ref(`profiles/${user.uid}`)
            .push(profileData);
        })
        .then(() => {
          // 書籍一覧画面の書籍の登録モーダルを閉じて、初期状態に戻す
          $("#add-book-modal").modal("hide");
          resetAddPostModal();
          //成功したらプロフィールページに情報を登録
        })
        .catch((error) => {
          // 失敗したとき
          console.error("エラー", error);
          resetAddPostModal();
        });
    } else {
      // 未ログイン
    }
  });
});

// 投稿の登録処理
$("#post-form").on("submit", (e) => {
  e.preventDefault();

  // 書籍の登録ボタンを押せないようにする
  $("#submit_add_book").prop("disabled", true).text("送信中…");

  firebase.auth().onAuthStateChanged((user) => {
    // ログイン状態が変化した
    if (user) {
      // 書籍タイトル
      const postName = $("#add-book-name").val();
      const postTitle = $("#add-book-title").val();
      const postDescription = $("#add-book-description").val();

      //投稿者のuidを取得
      const postUserId = user.uid;

      //セレクトボックスから値を取得
      const postSelect = $("#select").val();

      const $postImage = $("#add-book-image");
      const { files } = $postImage[0];

      if (files.length === 0) {
        // ファイルが選択されていないなら何もしない
        return;
      }

      const file = files[0]; // 表紙画像ファイル
      const filename = file.name; // 画像ファイル名
      const postImageLocation = `book-images/${filename}`; // 画像ファイルのアップロード先

      // 書籍データを保存する
      firebase
        .storage()
        .ref(postImageLocation)
        .put(file) // Storageへファイルアップロードを実行
        .then(() => {
          // Storageへのアップロードに成功したら、Realtime Databaseに書籍データを保存する
          const postData = {
            postName,
            postTitle,
            postSelect,
            postDescription,
            postImageLocation,
            postUserId,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
          };
          return firebase.database().ref('posts').push(postData);
        })
        .then(() => {
          // 書籍一覧画面の書籍の登録モーダルを閉じて、初期状態に戻す
          $("#add-book-modal").modal("hide");
          resetAddPostModal();
        })
        .catch((error) => {
          // 失敗したとき
          console.error("エラー", error);
          resetAddPostModal();
          $("#add-book__help").text("保存できませんでした。").fadeIn();
        });
    } else {
      // 未ログイン
    }
  });
});
