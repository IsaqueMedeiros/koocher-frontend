// import { initializeApp, cert, getApps } from 'firebase/app';
// import { getStorage } from 'firebase-admin/storage';

// export default async function handler(buffer, fileName, path) {
//   try {
//     // Inicializa o app Firebase apenas se ainda não estiver inicializado
//     if (!getApps().length) {
//       initializeApp({
//         credential: cert({
//           projectId: "your-project-id",
//           clientEmail: "your-client-email",
//           privateKey: "your-private-key"
//         }),
//         storageBucket: "your-storage-bucket-name"
//       });
//     }

//     const bucket = getStorage().bucket();
//     const fileUpload = bucket.file(`${path}/${fileName}`);

//     const blobStream = fileUpload.createWriteStream({
//       metadata: {
//         contentType: 'application/octet-stream' // ou o tipo MIME apropriado
//       }
//     });

//     return new Promise((resolve, reject) => {
//       blobStream.on('error', (error) => {
//         console.error('Erro ao fazer upload do arquivo:', error);
//         reject(error);
//       });

//       blobStream.on('finish', async () => {
//         try {
//           // Gera a URL pública do arquivo
//           const [publicUrl] = await fileUpload.getSignedUrl({
//             action: 'read',
//             expires: '03-09-2491' // uma data muito distante para que a URL não expire
//           });
//           resolve(publicUrl); // retorna a URL
//         } catch (error) {
//           console.error('Erro ao gerar a URL assinada:', error);
//           reject(error);
//         }
//       });

//       blobStream.end(buffer);
//     });
//   } catch (error) {
//     console.error('Erro:', error);
//     throw error; // re-lança o erro para que o chamador possa lidar com isso
//   }
// }
