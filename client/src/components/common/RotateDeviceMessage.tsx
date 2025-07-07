import { RotateCcw } from "lucide-react";

const RotateDeviceMessage = () => {
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-6">
          <RotateCcw className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-white mb-2">Please Rotate Your Device</h2>
          <p className="text-purple-300">This game is best experienced in landscape mode</p>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <div className="w-12 h-8 bg-purple-600 rounded border-2 border-purple-400"></div>
          <div className="text-purple-400">→</div>
          <div className="w-8 h-12 bg-purple-600 rounded border-2 border-purple-400"></div>
        </div>
      </div>
    </div>
  );
};

export default RotateDeviceMessage;