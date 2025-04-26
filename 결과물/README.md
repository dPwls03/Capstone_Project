# 화재 감지 시스템 사용법

## conda로 가상환경 먼저 설정하기

```bash
conda env list
cd backend
conda env create -f environment.yml
conda activate flameguard
conda deactivate
conda env remove --name flameguard
```

## YOLO 학습 방법
1. Universe에서 학습 데이터셋 찾기
2. 학습 데이터셋 다운로드
3. 다운로드한 데이터셋으로 학습
4. `best.pt` 파일 복사
5. 복사한 `best.pt` 파일을 프로젝트에 추가
6. 프로젝트에 추가한 `best.pt` 파일 사용
7. `best.pt` 파일로 테스트

## 실행하기

### Backend

```bash
cd backend/app
fastapi dev main.py
```

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```
