# ✅ 2주차: 데이터셋 학습

## YOLO 데이터셋 학습 및 실행

> 🔗 참고 자료  
- [데이터셋 다운](https://universe.roboflow.com/)
- [YOLO 학습 진행](https://docs.ultralytics.com/ko/modes/train/)
- [학습된 모델 사용](https://docs.ultralytics.com/ko/tasks/detect/)

> 데이터셋 다운로드

```
- `fire` 검색 후 다운로드 수가 많은 데이터셋 다운
- Format - YOLOv11, Download zip으로 다운
```

> 데이터셋 파일 경로 변경

```
- data.yaml 파일 열어서 확인
- 데이터셋 경로를 절대 경로로 설정
```

> 가상환경 진입
```bash
conda env list
conda activate flameguard
```

> 데이터셋 학습시키기 (Anaconda 가상환경에서 진행)
```bash
yolo detect train data=data.yaml model=yolo11n.pt epochs=100 imgsz=640
```
⚠️ epochs 수가 많을수록 모델이 더 안정적으로 학습될 가능성이 높다. 하지만 시간이 오래걸린다.

> 모델 사용 (Anaconda 가상환경에서 진행)
```bash
cd <weights 폴더 경로>
yolo detect predict model=best.pt source=<다운받은 사진>.jpg
```
