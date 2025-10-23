

export default function DotsSpinner() {
  return (
    <div className="flex items-center justify-center space-x-2 h-screen  backdrop-blur-sm">
      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-3 h-3 mr-2 bg-white rounded-full animate-bounce" />
    </div>
  );
}
