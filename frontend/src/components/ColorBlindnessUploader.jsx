import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, FileText } from "lucide-react"

const matrices = {
  protanopia: [
    [0.567, 0.433, 0.000],
    [0.558, 0.442, 0.000],
    [0.000, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0.000],
    [0.700, 0.300, 0.000],
    [0.000, 0.300, 0.700],
  ],
  tritanopia: [
    [0.950, 0.050, 0.000],
    [0.000, 0.433, 0.567],
    [0.000, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

function applyColorBlindnessEffect(imageData, matrix) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    data[i] = r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2]; // R
    data[i + 1] = r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2]; // G
    data[i + 2] = r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2]; // B
  }
  return imageData;
}

export default function ColorBlindnessUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    const reader = new FileReader();
reader.onload = (e) => {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const originalImageUrl = canvas.toDataURL(); // Save original image

    // Apply each filter and save the results
    const results = Object.entries(matrices).map(([type, matrix]) => {
      const filteredData = new ImageData(
        new Uint8ClampedArray(originalData.data),
        canvas.width,
        canvas.height
      );
      const transformed = applyColorBlindnessEffect(filteredData, matrix);

      const resultCanvas = document.createElement("canvas");
      resultCanvas.width = canvas.width;
      resultCanvas.height = canvas.height;
      resultCanvas.getContext("2d").putImageData(transformed, 0, 0);

      return {
        type,
        dataUrl: resultCanvas.toDataURL(),
      };
    });

    // Pass originalImage to results page
    navigate("/color-blindness-results", { state: { results, originalImage: originalImageUrl } });
  };
  img.src = e.target.result;
};
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mb-8">
        <label className="border border-gray-200 rounded-md p-6 flex flex-col items-center hover:shadow-md transition-shadow cursor-pointer">
          <input type="file" onChange={onFileChange} accept="image/*" className="hidden" />
          <div className="w-12 h-12 flex items-center justify-center text-blue-600 mb-3">
            <Upload className="w-8 h-8" />
          </div>
          <span className="text-blue-600 font-medium">Upload Image</span>
        </label>
      </div>

      {selectedFile && (
        <div className="text-center mb-6">
          <p className="mb-2">
            Selected file: <span className="font-medium">{selectedFile.name}</span>
          </p>
          <button
            onClick={onFileUpload}
            disabled={isUploading}
            className={`px-4 py-2 rounded-md ${
              isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white transition-colors`}
          >
            {isUploading ? "Processing..." : "Process File"}
          </button>
        </div>
      )}
    </div>
  );
}