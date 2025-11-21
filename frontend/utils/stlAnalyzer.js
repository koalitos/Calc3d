// Analisador de arquivos STL
export const analyzeSTL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const dataView = new DataView(arrayBuffer);
        
        // Verificar se é STL binário ou ASCII
        const isBinary = dataView.byteLength > 84;
        
        if (isBinary) {
          // STL Binário
          const numTriangles = dataView.getUint32(80, true);
          
          // Calcular volume usando o método de soma de tetraedros
          let volume = 0;
          let offset = 84; // Pular header (80 bytes) + número de triângulos (4 bytes)
          
          for (let i = 0; i < numTriangles; i++) {
            // Pular normal (12 bytes)
            offset += 12;
            
            // Ler vértices
            const v1 = {
              x: dataView.getFloat32(offset, true),
              y: dataView.getFloat32(offset + 4, true),
              z: dataView.getFloat32(offset + 8, true)
            };
            offset += 12;
            
            const v2 = {
              x: dataView.getFloat32(offset, true),
              y: dataView.getFloat32(offset + 4, true),
              z: dataView.getFloat32(offset + 8, true)
            };
            offset += 12;
            
            const v3 = {
              x: dataView.getFloat32(offset, true),
              y: dataView.getFloat32(offset + 4, true),
              z: dataView.getFloat32(offset + 8, true)
            };
            offset += 12;
            
            // Pular attribute byte count (2 bytes)
            offset += 2;
            
            // Calcular volume do tetraedro formado pela origem e o triângulo
            volume += signedVolumeOfTriangle(v1, v2, v3);
          }
          
          // Volume em mm³
          const volumeMM3 = Math.abs(volume);
          // Volume em cm³
          const volumeCM3 = volumeMM3 / 1000;
          
          // Estimar peso (PLA tem densidade ~1.24 g/cm³)
          const densityPLA = 1.24;
          const weightGrams = volumeCM3 * densityPLA;
          
          // Estimar tempo de impressão (muito aproximado)
          // Baseado em ~50mm³/s de velocidade de impressão
          const printSpeedMM3PerSec = 50;
          const timeSeconds = volumeMM3 / printSpeedMM3PerSec;
          const timeHours = timeSeconds / 3600;
          
          resolve({
            triangles: numTriangles,
            volumeMM3: volumeMM3.toFixed(2),
            volumeCM3: volumeCM3.toFixed(2),
            estimatedWeight: weightGrams.toFixed(2),
            estimatedTimeHours: timeHours.toFixed(2),
            fileSize: (file.size / 1024).toFixed(2) + ' KB'
          });
        } else {
          // STL ASCII - análise mais simples
          reject(new Error('STL ASCII não suportado ainda. Use STL binário.'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsArrayBuffer(file);
  });
};

// Função auxiliar para calcular volume de tetraedro
function signedVolumeOfTriangle(p1, p2, p3) {
  return (
    p1.x * p2.y * p3.z +
    p2.x * p3.y * p1.z +
    p3.x * p1.y * p2.z -
    p1.x * p3.y * p2.z -
    p2.x * p1.y * p3.z -
    p3.x * p2.y * p1.z
  ) / 6.0;
}
