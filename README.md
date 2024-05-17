<h1>폴더 구조</h1>

MOTION-BEAT / Frontend/<br>
├── /public<br>
│ └── /keySound(입력 시 악기음)<br>
│ │ └── /alldrum(드럼소리)<br>
│ │ └── /sounds(드럼소리2)<br>
│ └── /song(곡 목록)<br>
│ └── /thumbnail(곡 앨범 이미지)<br>
│<br>
├── /src<br>
│ └── /apis(소셜 로그인)<br>
│ └── /components(컴포넌트)<br>
│ │ └── /common(공용)<br>
│ │ └── /ingame(인게임)<br>
│ │ │ └── /game(인게임 내부 함수)<br>
│ │ │ │ └── /gameController.js(오디오 감지와 노트 생성)<br>
│ │ │ │ └── /gameLoader.js(인게임 진입 후 데이터 로드)<br>
│ │ │ │ └── /judgement.js(노트 타격 판정)<br>
│ │ │ /secondScore.js(점수&히트콤보 컴포넌트)<br>
│ │ └── /main(메인)<br>
│ │ └── /mediapipe(모션인식)<br>
│ │ └── /room(대기 방)<br>
│ └── /data(음악 재생 커스텀 훅)<br>
│ │ └── /soundData.json<br>
│ └── /fonts<br>
│ └── /img<br>
│ └── /pages(페이지)<br>
│ └── /redux<br>
│ └── /server<br>
│ └── /styles<br>
│ │ └── /common<br>
│ │ └── /ingame<br>
│ │ └── /main<br>
│ │ └── /room<br>
│ └── /utils<br>
├── app.js<br>
└── package.json<br>
