import React, { useState } from 'react';
import './App.css';

type PredictionResult = {
  class: string;
  confidence: number;
  all_probs: Record<string, number>;
  heatmap_base64?: string;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!login || !password) {
      alert('Введите логин и пароль');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        alert('Неверные данные для входа');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка соединения с сервером');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrediction(null);
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!audioFile) {
      alert('Выберите аудиофайл');
      return;
    }

    setIsLoading(true);
    setStatus('Отправка в модель...');

    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/process-audio/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        setStatus(`Ошибка: ${response.status} ${text}`);
        setPrediction(null);
      } else {
        const data = await response.json();
        setPrediction({
          class: data.class,
          confidence: data.confidence,
          all_probs: data.all_probs,
          heatmap_base64: data.heatmap_base64,
        });
        setStatus('Готово');
      }
    } catch (error) {
      console.error(error);
      setStatus('Ошибка запросa к серверу');
    }

    setIsLoading(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <h2>Вход в систему</h2>
        <form onSubmit={handleLogin} className="form">
          <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Логин" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
          <button type="submit">Войти</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2>Распознавание инопланетян</h2>

      <div className="card">
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!audioFile || isLoading}>
          {isLoading ? 'Обработка...' : 'Предсказать'}
        </button>

        {status && <p>Статус: {status}</p>}

        {prediction && (
          <div className="result-box">
            <p><strong>Класс:</strong> {prediction.class}</p>
            <p><strong>Уверенность:</strong> {prediction.confidence.toFixed(3)}</p>
            <div>
              <strong>Вероятности:</strong>
              <ul>
                {Object.entries(prediction.all_probs).map(([cls, prob]) => (
                  <li key={cls}>{cls}: {prob.toFixed(3)}</li>
                ))}
              </ul>
            </div>
            {prediction.heatmap_base64 && (
              <img
                src={prediction.heatmap_base64}
                alt="Mel spectrogram heatmap"
                style={{ width: '100%', maxWidth: 640, marginTop: 10 }}
              />
            )}
          </div>
        )}

        <button onClick={() => setIsLoggedIn(false)} className="danger">
          Выйти
        </button>
      </div>
    </div>
  );
}

export default App;
