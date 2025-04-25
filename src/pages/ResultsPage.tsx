import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Clock, Trophy } from 'lucide-react';

const ResultsPage = () => {
  const { user } = useAuth();
  const { candidates, electionActive, electionEndDate } = useData();
  const [chartData, setChartData] = useState<any[]>([]);
  const [winner, setWinner] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Check if election is over
  const isElectionOver = new Date() > new Date(electionEndDate);
  
  useEffect(() => {
    // Filter candidates for user's kelurahan
    const kelurahanCandidates = candidates.filter(
      candidate => candidate.kelurahan === user?.kelurahan
    );
    
    // Sort by vote count (highest first)
    const sortedCandidates = [...kelurahanCandidates].sort((a, b) => b.votes - a.votes);
    
    // Set the winner if election is over
    if (isElectionOver && sortedCandidates.length > 0) {
      setWinner(sortedCandidates[0]);
    }
    
    // Prepare data for chart
    const data = sortedCandidates.map(candidate => ({
      name: candidate.name.split(' ')[0], // Use only first name for chart
      fullName: candidate.name,
      votes: candidate.votes
    }));
    
    setChartData(data);
    
    // Only show results if:
    // 1. Election is over, or
    // 2. User has voted (can see partial results)
    setShowResults(isElectionOver || user?.hasVoted || false);
    
  }, [candidates, user, isElectionOver, electionEndDate]);
  
  if (!showResults) {
    return (
      <div className="page-container">
        <div className="text-center bg-yellow-50 py-12 px-4 rounded-xl border border-yellow-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
            <Clock size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Hasil Belum Tersedia</h1>
          <p className="text-gray-600 mb-2">
            Hasil pemilihan akan ditampilkan setelah Anda memberikan suara atau setelah periode pemilihan berakhir.
          </p>
          <p className="text-gray-600 mb-6">
            Silakan lakukan voting terlebih dahulu untuk melihat hasil sementara.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container">
      <h1 className="page-title">
        {isElectionOver ? 'Hasil Akhir Pemilihan' : 'Hasil Sementara'}
      </h1>
      
      {!isElectionOver && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle size={20} className="text-yellow-600 mr-2 flex-shrink-0 mt-1" />
          <p className="text-yellow-700">
            Ini adalah hasil sementara. Hasil final akan ditampilkan setelah periode pemilihan berakhir.
          </p>
        </div>
      )}
      
      {/* Winner announcement (only shown if election is over) */}
      {isElectionOver && winner && (
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <Trophy size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Ketua RT Terpilih</h2>
              <p className="text-white/90 text-lg">{winner.name}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-white/90">
              <span className="font-semibold">{winner.votes}</span> suara 
              ({chartData.length > 0 ? Math.round((winner.votes / chartData.reduce((sum, item) => sum + item.votes, 0)) * 100) : 0}%)
            </p>
          </div>
        </div>
      )}
      
      {/* Results Chart */}
      <div className="card p-6 mb-8">
        <h2 className="section-title">Perolehan Suara</h2>
        
        {chartData.length > 0 ? (
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  formatter={(value, name) => [`${value} suara`, 'Perolehan']}
                  labelFormatter={(value) => chartData.find(item => item.name === value)?.fullName || value}
                />
                <Legend wrapperStyle={{ bottom: 0 }} />
                <Bar dataKey="votes" name="Jumlah Suara" fill="#e53e3e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada data suara untuk ditampilkan</p>
          </div>
        )}
      </div>
      
      {/* Detailed Results Table */}
      <div className="card overflow-hidden">
        <h2 className="section-title p-6 pb-3 border-b">Detail Perhitungan Suara</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kandidat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Suara</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persentase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chartData.length > 0 ? (
                chartData.map((item, index) => (
                  <tr key={index} className={index === 0 && isElectionOver ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 && isElectionOver && <Trophy size={16} className="text-yellow-500 mr-2" />}
                        <span className={index === 0 && isElectionOver ? 'font-medium' : ''}>{item.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.votes} suara
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {chartData.reduce((sum, i) => sum + i.votes, 0) > 0 
                        ? Math.round((item.votes / chartData.reduce((sum, i) => sum + i.votes, 0)) * 100) 
                        : 0}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    Belum ada data suara
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
