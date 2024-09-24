// canvas 생성 START
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas 생성 END

// 변수 생성 START
const totalSnowflakes = 150;
const snowman = { x: canvas.width / 2, y: canvas.height - 150 };

let snowflakes = []; // 눈송이 배열
let snowmanOpacity = 1; // 눈사람의 투명도 (봄이 오면 점점 사라짐)
let isSpring = false; // 봄이 되었는지 여부
let flowerGrowth = 0; // 꽃이 자라는 정도

const maxBirds = 3; // 최대 새 개수
let birds = []; // 새 배열

// 새 이미지 생성
const birdImage = new Image();
birdImage.src = "bird.png"; // 이미지 소스 설정

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

// 눈송이 생성
for (let i = 0; i < totalSnowflakes; i++) {
  snowflakes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 1,
    speed: Math.random() * 1 + 0.5,
  });
}

// 눈사람 그리기
function drawSnowman() {
  if (snowmanOpacity <= 0) return; // 눈사람이 완전히 사라졌으면 그리지 않음

  ctx.save();
  ctx.globalAlpha = snowmanOpacity; // 투명도를 적용

  // 몸통 (세 개의 원)
  ctx.beginPath();
  ctx.arc(snowman.x, snowman.y, 50, 0, Math.PI * 2); // 몸통 아래
  ctx.arc(snowman.x, snowman.y - 70, 35, 0, Math.PI * 2); // 몸통 중간
  ctx.arc(snowman.x, snowman.y - 120, 25, 0, Math.PI * 2); // 머리
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  // 눈사람의 눈
  ctx.beginPath();
  ctx.arc(snowman.x - 10, snowman.y - 130, 3, 0, Math.PI * 2); // 왼쪽 눈
  ctx.arc(snowman.x + 10, snowman.y - 130, 3, 0, Math.PI * 2); // 오른쪽 눈
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();

  // 눈사람의 코 (당근)
  ctx.beginPath();
  ctx.moveTo(snowman.x, snowman.y - 125);
  ctx.lineTo(snowman.x + 15, snowman.y - 130);
  ctx.lineTo(snowman.x, snowman.y - 135);
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.closePath();

  ctx.restore();
}

// 새 그리기
function drawBirds() {
  if (!isSpring) return; // 봄이 아닐 경우 새를 그리지 않음

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

// 꽃 그리기
function drawFlower() {
  if (flowerGrowth <= 0) return; // 꽃이 아직 자라지 않았으면 그리지 않음

  ctx.save();
  ctx.translate(snowman.x, snowman.y); // 눈사람이 있던 자리에 꽃을 그림

  // 꽃 줄기
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -flowerGrowth * 30); // 꽃이 자랄수록 줄기가 길어짐
  ctx.strokeStyle = "green";
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.closePath();

  // 꽃잎 (네 개의 원)
  ctx.fillStyle = "pink";
  const petalRadius = flowerGrowth * 10; // 꽃이 자랄수록 꽃잎 커짐
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i;
    const x = Math.cos(angle) * petalRadius;
    const y = Math.sin(angle) * petalRadius - flowerGrowth * 30;
    ctx.beginPath();
    ctx.arc(x, y, petalRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  // 꽃 중심
  ctx.beginPath();
  ctx.arc(0, -flowerGrowth * 30, petalRadius / 2, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();

  ctx.restore();
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

// 겨울 -> 봄 배경 전환
function transitionToSpring() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  if (isSpring) {
    gradient.addColorStop(0, "lightgreen");
    gradient.addColorStop(1, "yellow");
  } else {
    gradient.addColorStop(0, "darkblue");
    gradient.addColorStop(1, "white");
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 메인 애니메이션 루프
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 하늘 변화 (봄으로 가는 애니메이션)
  transitionToSpring();

  if (!isSpring) {
    drawSnowflakes();
    moveSnowflakes();
  }

  drawSnowman();
  drawFlower();
  drawBirds(); // 여러 마리의 새 그리기

  if (isSpring) {
    // 눈사람 사라짐
    if (snowmanOpacity > 0) {
      snowmanOpacity -= 0.005; // 눈사람이 천천히 사라짐
    }

    // 꽃 자라기
    if (flowerGrowth < 1) {
      flowerGrowth += 0.01; // 꽃이 천천히 자람
    }
  }

  requestAnimationFrame(animate);
}

// 봄으로 전환 (몇 초 후 자동으로 봄으로 전환)
setTimeout(() => {
  isSpring = true;
}, 5000); // 5초 후 봄 시작

// 새 이미지 로드 후 애니메이션 시작
birdImage.onload = () => {
  animate();
};
