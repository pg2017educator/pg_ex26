// イベントログファイルをリポジトリ内に作成する
function createEventLogFile () {
  const user = getFieldValue('username')
  const pass = getFieldValue('password')
  const basicAuthData = getBasicAuthData(user, pass)

  const reponame = getFieldValue('reponame')
  const pathname = getFieldValue('pathname')
  const content = getFieldValue('content')

  const paramsCreateContent = {
    'method': 'PUT',
    'url': 'https://api.github.com/repos/' + user + '/' + reponame + '/contents/' + pathname,
    'basicAuthHeadder': basicAuthData,
    'callback': createFileResponse,
    'data': {
      'message': 'create',
      'content': base64encode(content)
    }
  }
  
  execute(paramsCreateContent)

}

function createFileResponse (json) {
  console.log(json)
}

function getBasicAuthData (user, pass) {
  return 'Basic ' + base64encode(user + ':' + pass)
}

function execute (params) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function() {
    switch ( xhr.readyState ) {
      case 0: // 未初期化状態.
        console.log('uninitialized!')
        break
      case 1: // データ送信中
        console.log('loading...')
        break
      case 2: // 応答待ち.
        console.log('loaded.')
        break
      case 3: // データ受信中
        //console.log('interactive... ' + xhr.responseText.length + ' bytes.')
        break
      case 4: // データ受信完了.
        if( xhr.status == 200 || xhr.status == 201 || xhr.status == 304 ) {
          //console.log(xhr.getAllResponseHeaders())
          if (params.callback) {
            params.callback(xhr.responseText)
          }
        } else {
            //console.log('Failed. HttpStatus: (' + xhr.status + ')' + xhr.statusText)
        }
        break
    }
  }

  // GithubのREST APIを呼び出す
  xhr.open(params.method, params.url)
  //リクエストヘッダの取得（”ヘッダの種類”、”値”）
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('Authorization', params.basicAuthHeadder)
  if (params.data) {
    //JSON.Stringfy関数　JavaScript値をJSON(大文字)で返却
    xhr.send(JSON.stringify(params.data))
  } else {
    xhr.send()
  }

}

function getFieldValue (id) {
  return document.getElementById(id).value
}

function appendResult (text) {
  const div = document.createElement("div")
  div.textContent = text;
  document.getElementById('result').appendChild(div)
}

//base64文字が必要なため、btoaに渡す形で取得
function base64encode (text) {
  return window.btoa(unescape(encodeURIComponent(text)))
}

document.getElementById("exec").addEventListener('click', createEventLogFile)