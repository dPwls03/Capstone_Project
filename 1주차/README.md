# ✅ 1주차: 라이브러리 및 프레임워크 설치

## conda 환경 설정

> 🔗 참고 자료  
- [Anaconda](https://www.anaconda.com/)
- [Anaconda Navigator 환경 관리 가이드](https://www.anaconda.com/docs/tools/anaconda-navigator/getting-started#managing-environments)

### python 3.9로 conda 가상 환경 생성

> conda 가상 환경 생성
```bash
conda create -n myenv python=3.9
```

> conda 가상 환경 활성화
```bash
conda activate myenv
```

> conda 가상 환경 비활성화
```bash
conda deactivate
```

> 생성된 가상환경 목록 확인
```bash
conda env list
```
or
```bash
conda info --envs
```

> 생성된 가상환경 삭제
```bash
conda remove --name myenv --all
```

## YOLO 설치

> 🔗 참고 자료 
- [YOLO github](https://github.com/ultralytics/ultralytics)

> conda로 가상환경 생성 후 YOLO 설치 및 설치 확인
```bash
conda create -n flameguard python=3.9
conda activate flameguard
pip install ultralytics
yolo
```

