// canvas 생성 START
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas 생성 END

// 변수 생성 START
const snowman = { x: canvas.width / 2, y: canvas.height - 150 };

let stage = "intro";
let currentBackgroundStage = "intro";
let snowflakes = []; // 전역 눈송이 배열

const maxBirds = 4; // 최대 새 개수
let birds = []; // 새 배열

const stages = [
  "intro",
  "verse1",
  "chorus1",
  "verse2",
  "chorus2",
  "bridge",
  "chorus3",
  "outro",
];

const stageDurations = {
  intro: 60000,
  verse1: 67000,
  chorus1: 34000,
  verse2: 28000,
  chorus2: 33000,
  bridge: 41000,
  chorus3: 40000,
  outro: 11000,
};

const snowmanImages = {
  verse1: new Image(),
  verse2: new Image(),
  chorus1: new Image(),
  chorus2: new Image(),
  bridge: new Image(),
  chorus3: new Image(),
  outro: new Image(),
};

snowmanImages.verse1.src = "assets/snowman/눈사람_미소.png";
snowmanImages.verse2.src = "assets/snowman/눈사람_시무룩.png";
snowmanImages.chorus1.src = "assets/snowman/눈사람_미소.png";
snowmanImages.chorus2.src = "assets/snowman/눈사람_시무룩.png";
snowmanImages.bridge.src = "assets/snowman/눈사람_그렁그렁.png";
snowmanImages.chorus3.src = "assets/snowman/눈사람_그렁그렁.png";
snowmanImages.outro.src = "assets/snowman/눈사람_미소.png";

const littlegirlImages = {
  verse1: new Image(),
  verse2: new Image(),
  chorus1: new Image(),
  chorus2: new Image(),
  bridge: new Image(),
  chorus3: new Image(),
  outro: new Image(),
};

littlegirlImages.verse1.src = "assets/littlegirl/소녀_무표정.png";
littlegirlImages.verse2.src = "assets/littlegirl/소녀_시무룩.png";
littlegirlImages.chorus1.src = "assets/littlegirl/소녀_웃음.png";
littlegirlImages.chorus3.src = "assets/littlegirl/소녀_미소.png";
littlegirlImages.outro.src = "assets/littlegirl/소녀_웃음.png";

const stageLyrics = {
  intro: "눈사람 - 정정훈",
  verse1:
    "멀리 배웅하던 길 여전히 나는 그곳에 서서\n그대가 사랑한 이 계절의 오고 감을 봅니다\n아무 노력 말아요 버거울 때면 언제든 나의 이름을 잊어요",
  chorus1:
    "꽃잎이 번지면 당신께도 새로운 봄이 오겠죠\n시간이 걸려도 그대 반드시 행복해지세요",
  verse2: "그 다음 말은 이젠 내가 해줄 수 없어서\n마음속에만 둘게요",
  chorus2:
    "꽃잎이 번지면 그럼에도 새로운 봄이 오겠죠\n한참이 걸려도 그대 반드시 행복해지세요",
  bridge:
    "끝 눈이 와요\n혹시 그대 보고 있나요\n슬퍼지도록 시리던\n우리의 그 계절이 가요",
  chorus3:
    "마지막으로 날 떠올려 준다면 안 되나요\n다시 한 번 더 같은 마음이고 싶어\n우릴 보내기 전에",
  outro: "몹시 사랑한 날들\n영원히 나는 이 자리에서",
};

let currentStageIndex = 0;

function updateStage() {
  if (currentStageIndex < stages.length) {
    const currentStage = stages[currentStageIndex];

    // 노래 가사 console
    const lyrics = stageLyrics[currentStage];
    console.log(`${lyrics}`);

    // 배경 설정
    if (currentBackgroundStage !== currentStage) {
      setStageBackground(currentStage); // 배경 업데이트
      currentBackgroundStage = currentStage; // 현재 배경 상태 업데이트
    }

    // 눈송이 개수를 Stage에 따라 변경
    const stageSnowflakeCounts = {
      intro: 230,
      verse1: 180,
      chorus1: 130,
      verse2: 40,
      chorus2: 0,
      bridge: 330,
      chorus3: 660,
      outro: 0,
    };

    const newSnowflakeCount = stageSnowflakeCounts[currentStage];
    initializeSnowflakes(newSnowflakeCount); // 눈송이 업데이트

    currentStageIndex++;
    stage = currentStage;

    const duration = stageDurations[currentStage];

    if (currentStageIndex < stages.length) {
      setTimeout(updateStage, duration);
    } else {
      setTimeout(() => {
        console.clear();
        currentStageIndex = 0; // 처음부터 다시 시작
        updateStage(); // intro로 돌아감
      }, 10000);
    }
  }
}

function initializeSnowflakes(count) {
  if (count > snowflakes.length) {
    // 눈송이를 추가
    for (let i = snowflakes.length; i < count; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
      });
    }
  } else if (count < snowflakes.length) {
    // 눈송이를 제거
    snowflakes = snowflakes.slice(0, count);
  }
}

// 새 이미지 생성
const birdImage = new Image();
birdImage.src = "assets/bird.png"; // 이미지 소스 설정

// 새 생성 함수
function createBird() {
  const startDirection = Math.random() < 0.5 ? 1 : -1; // 랜덤한 방향 (1: 오른쪽, -1: 왼쪽)
  return {
    x: startDirection === 1 ? 0 : canvas.width, // 초기 X 위치
    y: Math.random() * (canvas.height / 2), // Y축 위치
    speedX: (Math.random() * 2 + 1) * startDirection, // X축 속도
    speedY: Math.random() * 2 - 1, // Y축 속도 (-1 ~ 1 범위)
  };
}

// 초기 새 생성
for (let i = 0; i < maxBirds; i++) {
  birds.push(createBird());
}

// 눈사람 그리기
function drawSnowman() {
  if (stage == "intro") return;

  // stage에 맞는 눈사람 이미지 그리기
  const face = snowmanImages[stage];
  if (face) {
    ctx.drawImage(
      face,
      (canvas.width - 200) / 2,
      canvas.height - 250,
      200,
      250
    );
  }
}

// 소녀 그리기
function drawLittleGirl() {
  if (stage == "intro" || stage == "chorus2" || stage == "bridge") return;

  // stage에 맞는 소녀 이미지 그리기
  const face = littlegirlImages[stage];
  const dist = stage == "verse2" ? 320 : 100;
  if (face) {
    ctx.drawImage(
      face,
      (canvas.width - 200) / 2 - dist,
      canvas.height - 250,
      200,
      250
    );
  }
}

// 새 그리기
function drawBirds() {
  if (stage !== "outro") return;

  birds.forEach((bird, index) => {
    // 새 위치 업데이트
    bird.x += bird.speedX; // X 위치 업데이트
    bird.y += bird.speedY; // Y 위치 업데이트

    // Y축으로 위아래 움직임
    if (bird.y < 0 || bird.y > canvas.height / 2) {
      bird.speedY *= -1; // Y 방향 반전
    }

    // 새가 화면의 가장자리에 도달하면 새 생성
    if (bird.x > canvas.width || bird.x < 0) {
      birds[index] = createBird(); // 새로운 새 생성
      bird.y = Math.random() * (canvas.height / 2); // Y 위치 재설정
    }

    // 새 그리기
    ctx.drawImage(birdImage, bird.x, bird.y, 40, 40); // 새 이미지의 크기 설정
  });
}

// 눈송이 그리기
function drawSnowflakes() {
  snowflakes.forEach((snowflake) => {
    ctx.beginPath();
    ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  });
}

// background 설정 함수
function drawBackground() {
  setStageBackground(stage);
  currentBackgroundStage = stage; // 배경 상태 업데이트
}

// 눈송이 이동
function moveSnowflakes() {
  snowflakes.forEach((snowflake) => {
    snowflake.y += snowflake.speed;
    if (snowflake.y > canvas.height) {
      snowflake.y = 0;
      snowflake.x = Math.random() * canvas.width;
    }
  });
}

// background setting
function setStageBackground(stage) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

  if (stage === "intro") {
    gradient.addColorStop(0, "#5f77a3");
    gradient.addColorStop(1, "white");
  } else if (stage === "verse1") {
    gradient.addColorStop(0, "#87a2d3");
    gradient.addColorStop(1, "white");
  } else if (stage === "chorus1") {
    gradient.addColorStop(0, "#a5bde8");
    gradient.addColorStop(1, "white");
  } else if (stage === "verse2") {
    gradient.addColorStop(0, "#8897b3");
    gradient.addColorStop(1, "grey");
  } else if (stage === "chorus2") {
    gradient.addColorStop(0, "#402abd");
    gradient.addColorStop(1, "#8897b3");
  } else if (stage === "bridge") {
    gradient.addColorStop(0, "#292159");
    gradient.addColorStop(1, "white");
  } else if (stage === "chorus3") {
    gradient.addColorStop(0, "#292159");
    gradient.addColorStop(1, "white");
  } else {
    gradient.addColorStop(0, "#9ace87");
    gradient.addColorStop(1, "#ccce87");
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// intro 부터 시작
function startIntro() {
  stage = "intro";
  initializeSnowflakes(100);
  currentStageIndex = 0;
  updateStage();
}

// 메인 애니메이션 루프
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawSnowflakes();
  moveSnowflakes();
  drawSnowman();
  drawLittleGirl();
  drawBirds();

  requestAnimationFrame(animate);
}

startIntro();

birdImage.onload = () => {
  animate();
};
