

export const SkeletonLoader = () => {
  return (
    <div className="min-h-screen p-4 pt-[env(safe-area-inset-top)] bg-eco-fondo dark:bg-gray-950 pointer-events-none">
      <div className="max-w-md mx-auto pt-2 pb-32 space-y-6">
        
        {/* Header Esqueleto */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full animate-shimmer" />
          <div className="w-32 h-8 bg-gray-200 dark:bg-gray-800 rounded-xl animate-shimmer" />
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full animate-shimmer" />
        </div>

        {/* Dashboard Resumen Esqueleto */}
        <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] animate-shimmer w-full shadow-sm" />

        {/* Sub-cards Esqueleto */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-shimmer" style={{ animationDelay: '0.1s' }} />
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-shimmer" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* Pestañas Esqueleto */}
        <div className="flex gap-5 px-2 pt-2">
          <div className="w-20 h-7 bg-gray-200 dark:bg-gray-800 rounded-lg animate-shimmer" style={{ animationDelay: '0.3s' }} />
          <div className="w-24 h-7 bg-gray-200 dark:bg-gray-800 rounded-lg animate-shimmer" style={{ animationDelay: '0.35s' }} />
        </div>

        {/* Tarjetas de Lista Esqueleto */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="h-20 glass-card border border-gray-100 dark:border-gray-800 rounded-2xl w-full flex items-center p-4 gap-4 border-l-accent border-l-gray-200 dark:border-l-gray-700"
              style={{ animationDelay: `${0.4 + i * 0.08}s` }}
            >
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl shrink-0 animate-shimmer" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4 animate-shimmer" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-md w-1/3 animate-shimmer" />
              </div>
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded-md shrink-0 animate-shimmer" />
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};