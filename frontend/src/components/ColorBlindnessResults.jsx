import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Download, Share2, ArrowLeft } from "lucide-react";

export default function ColorBlindnessResults() {
  const location = useLocation();
  const results = location.state?.results || [];
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const handleDownloadAll = () => {
    simulations.forEach((sim) => {
      const link = document.createElement("a");
      link.href = sim.imageUrl;
      link.download = `${sim.name.replace(/\s+/g, "_").toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleShare = () => {
    // Check if Web Share API is supported
    if (navigator.share) {
      navigator
        .share({
          title: "Image Description",
        })
        .catch((error) => {
          console.log("Error sharing:", error)
        })
    } else {
      navigator.clipboard
        .writeText(description)
        .then(() => {
          alert("Description copied to clipboard!")
        })
        .catch(() => {
          alert("Failed to copy description")
        })
    }
  }

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  

  // If no results (user navigated directly), show fallback
  if (!results.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">No results to display</h2>
          <Link
            to="/color-blindness-tools"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Try Another
          </Link>
        </div>
      </div>
    );
  }

  // Compose the simulations array from results
  const simulations = [
    {
      id: "original",
      name: "Original",
      description: "How most people see your image",
      imageUrl: location.state.originalImage || results[0]?.dataUrl,
      filter: "",
    },
    ...results.map((r) => ({
      id: r.type,
      name:
        r.type === "protanopia"
          ? "Protanopia"
          : r.type === "deuteranopia"
          ? "Deuteranopia"
          : r.type === "tritanopia"
          ? "Tritanopia"
          : r.type === "achromatopsia"
          ? "Achromatopsia"
          : r.type,
      description:
        r.type === "protanopia"
          ? "Red-blind (1% of men)"
          : r.type === "deuteranopia"
          ? "Green-blind (1% of men)"
          : r.type === "tritanopia"
          ? "Blue-blind (rare)"
          : r.type === "achromatopsia"
          ? "Complete color blindness"
          : "",
      imageUrl: r.dataUrl,
      filter: "",
    })),
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium">Processing your image...</h2>
          <p className="text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Color Blindness Simulation Results
      </h1>

      <div className="mb-8 flex flex-col m-auto justify-between items-center">
        
        <div className="flex gap-2">
          <button
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            onClick={handleDownloadAll}
          >
            <Download className="mr-2 h-4 w-4" /> Download All
          </button>
          <button 
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          onClick={handleShare}
          aria-label="Share description">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </button>
          <Link
            to="/color-blindness-tools"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Try Another
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            <button
              className={`px-4 py-1 rounded-full text-sm ${
                activeTab === "all" ? "bg-teal-500 text-white" : "text-gray-700"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            {simulations.map((sim) => (
              <button
                key={sim.id}
                className={`px-4 py-1 rounded-full text-sm ${
                  activeTab === sim.id
                    ? "bg-teal-500 text-white"
                    : "text-gray-700"
                }`}
                onClick={() => setActiveTab(sim.id)}
              >
                {sim.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {activeTab === "all"
          ? simulations.map((sim) => (
              <div key={sim.id} className="border rounded-lg overflow-hidden">
                <div className="">
                  <img
                    src={sim.imageUrl || "/placeholder.svg"}
                    alt={`${sim.name} simulation`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{sim.name}</h3>
                  <p className="text-sm text-gray-500">{sim.description}</p>
                </div>
              </div>
            ))
          : simulations
              .filter((sim) => sim.id === activeTab)
              .map((sim) => (
                <div
                  key={sim.id}
                  className="border rounded-lg overflow-hidden col-span-full max-w-3xl mx-auto"
                >
                  <div className="">
                    <img
                      src={sim.imageUrl || "/placeholder.svg"}
                      alt={`${sim.name} simulation`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{sim.name}</h3>
                    <p className="text-sm text-gray-500">{sim.description}</p>
                  </div>
                </div>
              ))}
      </div>
    </div>
  );
}
