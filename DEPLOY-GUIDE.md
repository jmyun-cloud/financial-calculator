# 웹사이트 호스팅 정석 가이드 (GitHub + Vercel)

웹사이트를 인터넷에 서비스하기 위해 가장 많이 사용하는 개발 표준 방식인 **GitHub + Vercel** 배포 가이드입니다.

현재 PC에 코드를 버전 관리하고 GitHub에 올리기 위한 필수 프로그램인 `Git`이 설치되어 있지 않은 것으로 확인됩니다. 따라서 가장 기초적인 설치부터 차근차근 시작해 봅시다!

---

## 단계 1: 시스템 준비 (Git 설치하기)

코드를 인터넷 밖으로 내보내려면 **Git(깃)**이라는 프로그램이 있어야 합니다.

1. **Git 다운로드:** [https://git-scm.com/download/win](https://git-scm.com/download/win) 에 접속하여 현재 운영체제(Windows)에 맞는 버전을 다운로드하고, 클릭을 계속 눌러 기본 설정으로 설치합니다.
2. 설치가 끝난 후, 원활한 작동을 위해 **VS Code를 껐다가 다시 켜주세요.**

---

## 단계 2: GitHub 회원가입 (코드 저장소)

우리의 코드를 영구적으로 보관하고 버전 관리를 해 줄 클라우드 저장소입니다.

1. [https://github.com/](https://github.com/) 에 접속합니다.
2. **Sign up(회원가입)** 버튼을 눌러 계정을 생성합니다.
3. 이메일 인증까지 완료하여 로그인이 된 상태를 유지합니다.

---

## 단계 3: 내 코드를 GitHub에 업로드하기

자, 이제 내 컴퓨터(로컬)에 있는 코드를 GitHub(인터넷)으로 쏘아 올릴 차례입니다.

VS Code 상단의 메뉴에서 `Terminal(터미널) > New Terminal(새 터미널)`을 클릭하여 하단에 터미널 창을 엽니다. (단축키: `Ctrl + \``)

터미널 창에 아래 명령어들을 한 줄씩 순서대로 복사해서 붙여넣고 엔터를 치세요!
(첫 사용 시 본인 환경에 맞춰 세팅하는 과정입니다.)

```bash
# 1. 깃(Git) 시작하기 - 현재 폴더를 Git 저장소로 만듭니다.
git init

# 2. 내 컴퓨터를 Git에 인식시키기 (GitHub 가입 이메일 & 이름 입력)
# (Your.Name 과 your.email@example.com 을 깃허브 가입 이메일로 바꿔서 입력)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 3. 지금 수정/작성한 모든 파일을 다음 캡슐에 넣기
git add .

# 4. 캡슐에 메모(코멘트) 달고 포장 끝내기
git commit -m "첫 계산기 사이트 배포準備 완료!"
```

--------------------------------------------------------------------------------------

자, 여기까지 캡슐 포장이 끝났습니다.
이제 이 포장을 GitHub로 쏘아 올리기 위해, **GitHub 사이트에 로켓 발사대(Repository)를 만들어야 합니다.**

### 3-1. GitHub에 새 저장소 만들기
1. GitHub 로그인 후 우측 상단 `+` 아이콘 클릭 -> **[New repository]**
2. **Repository name** 에 `financial-calculator` 같은 영어 이름을 씁니다.
3. 밑의 `Public` (공개) 라디오 버튼이 체크된 상태로 둡니다. (무료 호스팅 필수)
4. 맨 아래 초록색 **[Create repository]** 버튼을 클릭!

### 3-2. 로켓 쏘아 올리기 (다시 VS Code 터미널로)
저장소 생성이 끝나면 깃허브 화면에 여러 코드가 뜰 겁니다. 그중 "…or push an existing repository from the command line" 부분을 복사해 터미널에 붙여넣습니다.

대략 아래와 같이 3줄로 되어 있습니다. (본인 깃허브 주소 확인!)
```bash
# 내 컴퓨터 폴더와 방금 만든 GitHub 저장소를 연결 (주소는 자신의 것으로)
git remote add origin https://github.com/내아이디/financial-calculator.git
git branch -M main
# 인터넷(GitHub)으로 내 코드들을 영구 보존! (쏴 올리기)
git push -u origin main
```
> (만약 로그인 창이 뜬다면, 브라우저를 통해 깃허브 계정 접근을 허가해주시면 됩니다.)

👏 "Branch 'main' set up to track remote branch 'main' from 'origin'." 이라는 비슷한 메시지가 나오면서 `100% (xx/xx)` 가 뜨면 **성공적으로 코드가 인터넷에 올라간 것입니다!**

---

## 단계 4: Vercel로 인터넷에 배포 (호스팅)

코드가 인터넷(GitHub)에 있으니, 이제 이 코드를 읽어서 전 세계 사람들이 24시간 접속할 수 있도록 주소를 달아줘야겠죠? 이 역할을 🚀**Vercel** 이 해줍니다.

1. [https://vercel.com/](https://vercel.com/) 접속 후 **Sign Up** 클릭
2. **Continue with GitHub** (방금 만든 깃허브 계정으로 연동 가입) 버튼 클릭
3. Vercel 메인 화면에서 까만색 버튼 **[Add New...] -> [Project]** 클릭
4. 아까 만든 `financial-calculator` 저장소가 보일 겁니다. 옆에 있는 **[Import]** 클릭
5. 다른 설정 건드릴 필요 없이 화면 중앙의 파란색 **[Deploy(배포)]** 버튼 클릭!
6. 약 30초~1분 후 축하 꽃가루🎉와 함께 **[Continue to Dashboard]** 가 뜹니다.

---

🎊 **수고하셨습니다! 이제 전 세계 누구나 접속할 수 있습니다.**
대시보드 화면에 적힌 `https://financial-calculator-blabla.vercel.app` 과 같은 Vercel 주소를 클릭하시면 우리가 만든 계산기 사이트가 딱! 열리는 것을 볼 수 있습니다.

> **💡 핵심 요약 (정석 배포의 장점):**
> 앞으로 코드를 조금이라도 수정하신 뒤에,
> VScode 에서 터미널을 열고
> `git add .` -> `git commit -m "수정내용"` -> `git push`
> 이 **3줄 명령어만 치면 Vercel이 알아서(수 초 만에) 인터넷 사이트를 최신 버전으로 새로고침** 해줍니다!

여기까지 차례대로 한 번 진행해 보시고, 오류가 나거나 막히는 부분(특히 터미널 쪽에 에러가 뜰 수 있음)이 있다면 언제든 다시 이 창에 질문해 주세요! 화면에 나온 에러 메시지를 복사해서 알려주시면 즉각 해결해 드리겠습니다.
