export default function CustomerListSkeleton() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header Skeleton */}
        <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse"></div>
                <div>
                  <div className="h-8 bg-gray-200 rounded-lg w-32 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 bg-gray-200 rounded-xl w-20 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
  
        <div className="p-6">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse"></div>
              </div>
            ))}
          </div>
  
          {/* Search and Filters Skeleton */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
  
          {/* Customer Table Skeleton */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Table Header Skeleton */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="ml-6 grid grid-cols-12 gap-4 w-full">
                  <div className="col-span-3 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="col-span-1 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
  
            {/* Customer Rows Skeleton */}
            <div className="divide-y divide-gray-200">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="ml-6 grid grid-cols-12 gap-4 w-full items-center">
                      {/* Customer Info */}
                      <div className="col-span-3 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </div>
                      </div>
                      {/* Contact */}
                      <div className="col-span-2 space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                      </div>
                      {/* Company */}
                      <div className="col-span-2">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                      {/* Status */}
                      <div className="col-span-2">
                        <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                      </div>
                      {/* Total Spent */}
                      <div className="col-span-2">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                      {/* Actions */}
                      <div className="col-span-1 flex space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  