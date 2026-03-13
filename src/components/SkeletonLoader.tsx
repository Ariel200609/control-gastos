

export const SkeletonLoader = () => {
  return (
    <div className="min-h-screen p-4 pt-[env(safe-area-inset-top)] bg-eco-fondo dark:bg-gray-950 pointer-events-none">
      <div className="max-w-md mx-auto pt-2 pb-32 space-y-6">
        
        {/* Header Esqueleto */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          <div className="w-32 h-8 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
        </div>

        {/* Dashboard Resumen Esqueleto */}
        <div className="h-56 bg-gray-200 dark:bg-gray-800 rounded-[2rem] animate-pulse w-full shadow-sm" />

        {/* Pestañas Esqueleto */}
        <div className="flex gap-5 px-2 pt-2">
          <div className="w-20 h-7 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="w-24 h-7 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>

        {/* Tarjetas de Lista Esqueleto */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl animate-pulse w-full flex items-center p-4 gap-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-md w-1/3" />
              </div>
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded-md shrink-0" />
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};