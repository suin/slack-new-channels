# @suin/slack-new-channels

Slackに新しいチャンネルが作られた際に通知するSlackボットアプリケーションです。

## インストール方法

### Slackアプリを作る

- [Your Apps](https://api.slack.com/apps/)の「Create New App」ボタンをクリック
- 「Create an app」ダイアログが開くので、「From scratch」を選ぶ。
- 「Name app & choose workspace」ダイアログが開くので、次のフィールドを埋める。
  - 「App Name」: 任意の名前。例: newchannels
  - 「Pick a workspace to develop your app in:」: あなたのワークスペース
- 「Create App」ボタンを押す。すると、アプリが作られ「Basic Information」ページが表示される。

### アプリの権限設定

- 「OAuth & Permissions」を開き、「Scopes」で「Bot Token Scopes」に下記の権限を付与する
  - channels:read
  - chat:write

### ボットの設定

- 「App Home」を開き、「Your App’s Presence in Slack」の次のフィールドを設定する
  - 「Add App Display Name」
    - 「Display Name (Bot Name)」: 任意の名前。例: newchannels
    - 「Default username」: 任意の名前。例: newchannels

### アプリをワークスペースにインストールする

- 「Install App」を開き、「Install to Workspace」ボタンをクリックする。
- 「newchannels が XXX ワークスペースにアクセスする権限をリクエストしています」と出るので、「許可する」ボタンを押す。
- すると、「Install App Settings」ページが表示され、そこに「Bot User OAuth Token」が表示されるので、その値をメモしておく。

### 通知用チャネルを作る

- Slackのアプリを開き、新着チャンネルを投稿するためのチャネルを作る
  - チャネル名は任意。例: newchannels
- そのチャネルに上で作ったボットユーザーを招待する
  - 上で設定したボット名(例: `@newchannels`)でメンションすると招待できる。
- チャネルのIDを控える
  - チャネルのヘッダの「#newchannels ⌄」をクリックして「チャンネル情報」を表示する。
  - そこに「チャンネルID」が表示されているのでコピーして控えておく。
    - `C03XXXXXXX`のようなID

### このプログラムをVercelにデプロイする

このプログラムをVercelにデプロイしてください。

- Vercelの環境設定で下記の値をセットする
  - `CHANNEL`: 上で控えた「チャンネルID」。`C03XXXXXXX`のようなID
  - `TOKEN`: 上で控えた「Bot User OAuth Token」。`xoxb-12345678-...`のようなトークン
  - `MESSAGE`: 通知の文言。デフォルトは「A new channel {channel} was created by {creator}. Check it now!」 (任意)
  - `CHANNEL_IGNORED`: 通知を除外するチャンネル名の正規表現。例: `^_pr_` (任意)

環境変数をセットしたら、再度デプロイして、環境変数を効かせる必要があります。

### ボットがメッセージを受信できるようにする

- 「Event Subscriptions」を開き、「Enable Events」を「On」にする。
- 「Request URL」にVercelのURLを入れる
  - `https://$project_name.vercel.app/api`のようなURL
- URLを入れると「Verified」と表示され、フィードチャネルにテストメッセージがボットから投稿される。
- 「Subscribe to bot events」の「Add Bot User Event」をクリックし、次のイベントを追加する。
  - `channel_created`
- 「Save Changes」ボタンを押して保存する。

