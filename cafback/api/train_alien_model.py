from .AI_logic import train_model

if __name__ == '__main__':
    # Путь к датасету, загруженному в папку api
    npz_path = 'c:\\Users\\user5\\Desktop\\AI\\back\\cafback\\api\\Data.npz'
    model_path = 'c:\\Users\\user5\\Desktop\\AI\\back\\cafback\\api\\models\\alien_model.pth'

    # Запустить обучение
    train_model(npz_path=npz_path, model_path=model_path, epochs=20, batch_size=16, lr=1e-3)
