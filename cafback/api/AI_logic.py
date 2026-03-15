import os
import json
import numpy as np
import librosa
import librosa.display
import matplotlib.pyplot as plt
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import transforms

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'alien_model.pth')
HEATMAP_DIR = os.path.join(os.path.dirname(__file__), 'heatmaps')

if not os.path.exists(HEATMAP_DIR):
    os.makedirs(HEATMAP_DIR, exist_ok=True)


class SimpleCNN(nn.Module):
    def __init__(self, n_classes):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=3, padding=1),
            nn.BatchNorm2d(16),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.AdaptiveAvgPool2d((1, 1)),
            nn.Flatten(),
            nn.Linear(64, n_classes)
        )

    def forward(self, x):
        return self.net(x)


class AlienClassifier:
    def __init__(self, model_path=MODEL_PATH):
        self.classes = ["Марсианин", "Венерянец", "Альфа-Центавриец", "Рептилоид"]
        self.model_path = model_path
        self.model = None
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self._load_model()
        print("Система распознавания инопланетян готова.")

    def _load_model(self):
        if os.path.exists(self.model_path):
            self.model = SimpleCNN(len(self.classes)).to(self.device)
            self.model.load_state_dict(torch.load(self.model_path, map_location=self.device))
            self.model.eval()
        else:
            self.model = SimpleCNN(len(self.classes)).to(self.device)
            self.model.eval()

    @staticmethod
    def _audio_to_melspectrogram(y, sr, n_mels=64, n_fft=2048, hop_length=512):
        S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=n_mels, n_fft=n_fft, hop_length=hop_length)
        S_db = librosa.power_to_db(S, ref=np.max)
        return S_db

    @staticmethod
    def _save_heatmap(S_db, filename):
        plt.figure(figsize=(6, 4))
        librosa.display.specshow(S_db, sr=22050, x_axis='time', y_axis='mel', cmap='magma')
        plt.colorbar(format='%+2.0f dB')
        plt.title('Мел-спектрограмма (тепловая карта)')
        plt.tight_layout()
        path = os.path.join(HEATMAP_DIR, filename)
        plt.savefig(path)
        plt.close()
        return path

    def file_to_tensor(self, file_path, target_sr=22050, duration=3.0):
        y, sr = librosa.load(file_path, sr=target_sr, duration=duration)
        if y.size == 0:
            raise ValueError('Неверный аудиофайл или пустой сигнал')
        S_db = self._audio_to_melspectrogram(y, sr)
        self._save_heatmap(S_db, os.path.basename(file_path) + '_heatmap.png')

        # Нормализация
        x = (S_db - np.mean(S_db)) / (np.std(S_db) + 1e-6)
        x = torch.tensor(x, dtype=torch.float32).unsqueeze(0).unsqueeze(0)
        return x

    def predict(self, file_path):
        if self.model is None:
            raise RuntimeError('Модель не загружена')

        x = self.file_to_tensor(file_path).to(self.device)
        with torch.no_grad():
            out = self.model(x)
            probs = torch.softmax(out, dim=1).cpu().numpy()[0]
            idx = int(np.argmax(probs))

        heatmap_filename = os.path.basename(file_path) + '_heatmap.png'
        heatmap_fullpath = os.path.join(HEATMAP_DIR, heatmap_filename)

        return {
            'class': self.classes[idx],
            'confidence': float(probs[idx]),
            'all_probs': {self.classes[i]: float(probs[i]) for i in range(len(self.classes))},
            'heatmap_file': heatmap_filename,
            'heatmap_path': heatmap_fullpath
        }

    def process_audio(self, file_path):
        # Совместимость с текущим view
        return self.predict(file_path)


def train_model(npz_path, model_path=MODEL_PATH, epochs=20, batch_size=16, lr=1e-3):
    data = np.load(npz_path, allow_pickle=True)
    train_x = data['train_x']
    train_y = data['train_y']
    valid_x = data['valid_x']
    valid_y = data['valid_y']

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = SimpleCNN(len(AlienClassifier().classes)).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)

    def make_tensor(sample):
        if isinstance(sample, str):
            y, sr = librosa.load(sample, sr=22050, duration=3.0)
        else:
            y = np.asarray(sample, dtype=np.float32)
            sr = 22050
        S_db = AlienClassifier._audio_to_melspectrogram(y, sr)
        x = (S_db - np.mean(S_db)) / (np.std(S_db) + 1e-6)
        x = torch.tensor(x, dtype=torch.float32).unsqueeze(0)
        return x

    # simple training loop
    for epoch in range(1, epochs + 1):
        model.train()
        epoch_loss = 0.0

        permutation = np.random.permutation(len(train_x))
        for i in range(0, len(train_x), batch_size):
            indices = permutation[i:i + batch_size]
            batch_x = [make_tensor(train_x[j]) for j in indices]
            batch_y = torch.tensor([int(train_y[j]) for j in indices], dtype=torch.long)
            batch_x = torch.stack(batch_x).to(device)
            batch_y = batch_y.to(device)

            optimizer.zero_grad()
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()

            epoch_loss += loss.item() * batch_x.size(0)

        epoch_loss /= len(train_x)

        # валидация
        model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for i in range(len(valid_x)):
                x = make_tensor(valid_x[i]).unsqueeze(0).to(device)
                y_true = int(valid_y[i])
                out = model(x)
                pred = int(torch.argmax(out, dim=1).item())
                correct += (pred == y_true)
                total += 1
        val_acc = correct / total if total else 0.0

        print(f"Эпоха {epoch}/{epochs} - loss {epoch_loss:.4f} - val_acc {val_acc:.4f}")

    torch.save(model.state_dict(), model_path)
    print('Модель сохранена в', model_path)


# Инициализируем модульный экземпляр
ai_instance = AlienClassifier()