// app/utils/uploadFile.ts
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDAhVG7-HbFOz9hRRTFte90tpJova6Te0g",
  authDomain: "koocher-3dcfb.firebaseapp.com",
  projectId: "koocher-3dcfb",
  storageBucket: "koocher-3dcfb.appspot.com",
  messagingSenderId: "649591407796",
  appId: "1:649591407796:web:48d15c4b3cb704819a03e1",
  measurementId: "G-9P0YS7Z94X",
};

// Inicializando o Firebase fora da função para evitar reinicializações desnecessárias
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Definição do tipo para a função de progresso
type ProgressCallback = (progress: number) => void;

// Função para realizar o upload do arquivo e obter a URL de download
const UploadFile = (file: File, onProgress?: ProgressCallback): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Verificações de arquivo permanecem as mesmas...

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calcula a progressão do upload
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error("Erro durante o upload:", error);
        reject(new Error(`Erro durante o upload: ${error.code}`));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            // Aqui você pode verificar se a URL contém os cabeçalhos CORS corretos
            fetch(downloadURL, { method: 'HEAD' })
              .then(response => {
                if (response.headers.get('access-control-allow-origin')) {
                  resolve(downloadURL);
                } else {
                  reject(new Error("CORS não configurado corretamente para esta URL"));
                }
              })
              .catch(error => {
                console.error("Erro ao verificar CORS:", error);
                reject(new Error("Erro ao verificar CORS"));
              });
          })
          .catch((error) => {
            console.error("Erro ao obter URL de download:", error);
            reject(new Error("Erro ao obter URL de download."));
          });
      }
    );
  });
};

export default UploadFile;
