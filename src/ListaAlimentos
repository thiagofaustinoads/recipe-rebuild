import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Simula dados da tela anterior (recuperados automaticamente)
const getDadosTelaAnterior = () => {
  return {
    userId: 'user-123',
    userName: 'João Silva',
    dataSessao: new Date().toISOString(),
    metaNutricional: {
      caloriasAlvo: 2000,
      carboidratosAlvo: 250,
      proteinasAlvo: 150,
      gordurasAlvo: 65
    }
  };
};

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

const AlimentosScreen = () => {
  const [alimentos, setAlimentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [alimentoEditando, setAlimentoEditando] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [dadosTelaAnterior] = useState(getDadosTelaAnterior());
  
  const [formData, setFormData] = useState({
    nome_alimento: '',
    calorias: '',
    carboidratos: '',
    proteinas: '',
    gorduras: '',
    fibra: ''
  });

  // Carregar alimentos do localStorage ao montar
  useEffect(() => {
    const alimentosSalvos = localStorage.getItem('alimentos_taco');
    if (alimentosSalvos) {
      setAlimentos(JSON.parse(alimentosSalvos));
    } else {
      // Dados iniciais da tabela TACO
      const alimentosIniciais = [
        { id: 1, nome_alimento: 'Arroz branco cozido', calorias: 128, carboidratos: 28.1, proteinas: 2.5, gorduras: 0.2, fibra: 0.2 },
        { id: 2, nome_alimento: 'Feijão preto cozido', calorias: 77, carboidratos: 13.6, proteinas: 4.5, gorduras: 0.5, fibra: 4.5 },
        { id: 3, nome_alimento: 'Peito de frango grelhado', calorias: 165, carboidratos: 0, proteinas: 31, gorduras: 3.6, fibra: 0 },
        { id: 4, nome_alimento: 'Batata inglesa cozida', calorias: 86, carboidratos: 20, proteinas: 1.9, gorduras: 0.1, fibra: 1.3 },
        { id: 5, nome_alimento: 'Maçã com casca', calorias: 56, carboidratos: 15, proteinas: 0.3, gorduras: 0.4, fibra: 1.3 }
      ];
      setAlimentos(alimentosIniciais);
      localStorage.setItem('alimentos_taco', JSON.stringify(alimentosIniciais));
    }
  }, []);

  // Salvar no localStorage sempre que alimentos mudar
  useEffect(() => {
    if (alimentos.length > 0) {
      localStorage.setItem('alimentos_taco', JSON.stringify(alimentos));
    }
  }, [alimentos]);

  // Calcular totais para o gráfico
  const calcularTotais = () => {
    return alimentos.reduce((acc, alimento) => ({
      calorias: acc.calorias + (parseFloat(alimento.calorias) || 0),
      carboidratos: acc.carboidratos + (parseFloat(alimento.carboidratos) || 0),
      proteinas: acc.proteinas + (parseFloat(alimento.proteinas) || 0),
      gorduras: acc.gorduras + (parseFloat(alimento.gorduras) || 0)
    }), { calorias: 0, carboidratos: 0, proteinas: 0, gorduras: 0 });
  };

  const totais = calcularTotais();

  const dadosGraficoPizza = [
    { name: 'Carboidratos', value: totais.carboidratos, color: COLORS[0] },
    { name: 'Proteínas', value: totais.proteinas, color: COLORS[1] },
    { name: 'Gorduras', value: totais.gorduras, color: COLORS[2] }
  ].filter(item => item.value > 0);

  const dadosGraficoBarras = [
    { nutriente: 'Calorias', total: totais.calorias, meta: dadosTelaAnterior.metaNutricional.caloriasAlvo },
    { nutriente: 'Carboidratos (g)', total: totais.carboidratos, meta: dadosTelaAnterior.metaNutricional.carboidratosAlvo },
    { nutriente: 'Proteínas (g)', total: totais.proteinas, meta: dadosTelaAnterior.metaNutricional.proteinasAlvo },
    { nutriente: 'Gorduras (g)', total: totais.gorduras, meta: dadosTelaAnterior.metaNutricional.gordurasAlvo }
  ];

  const alimentosFiltrados = alimentos.filter(a => 
    a.nome_alimento.toLowerCase().includes(busca.toLowerCase())
  );

  const mostrarMensagem = (texto, tipo) => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
  };

  const abrirModal = (alimento = null) => {
    if (alimento) {
      setAlimentoEditando(alimento);
      setFormData({
        nome_alimento: alimento.nome_alimento,
        calorias: alimento.calorias.toString(),
        carboidratos: alimento.carboidratos.toString(),
        proteinas: alimento.proteinas.toString(),
        gorduras: alimento.gorduras.toString(),
        fibra: alimento.fibra.toString()
      });
    } else {
      setAlimentoEditando(null);
      setFormData({
        nome_alimento: '',
        calorias: '',
        carboidratos: '',
        proteinas: '',
        gorduras: '',
        fibra: ''
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setAlimentoEditando(null);
    setFormData({
      nome_alimento: '',
      calorias: '',
      carboidratos: '',
      proteinas: '',
      gorduras: '',
      fibra: ''
    });
  };

  const salvarAlimento = () => {
    if (!formData.nome_alimento.trim()) {
      mostrarMensagem('Nome do alimento é obrigatório', 'error');
      return;
    }

    const novoAlimento = {
      id: alimentoEditando ? alimentoEditando.id : Date.now(),
      nome_alimento: formData.nome_alimento,
      calorias: parseFloat(formData.calorias) || 0,
      carboidratos: parseFloat(formData.carboidratos) || 0,
      proteinas: parseFloat(formData.proteinas) || 0,
      gorduras: parseFloat(formData.gorduras) || 0,
      fibra: parseFloat(formData.fibra) || 0,
      data_registro: new Date().toISOString(),
      dados_tela_anterior: dadosTelaAnterior
    };

    if (alimentoEditando) {
      setAlimentos(alimentos.map(a => a.id === alimentoEditando.id ? novoAlimento : a));
      mostrarMensagem('Alimento atualizado com sucesso!', 'success');
    } else {
      setAlimentos([...alimentos, novoAlimento]);
      mostrarMensagem('Alimento adicionado com sucesso!', 'success');
    }

    fecharModal();
  };

  const excluirAlimento = (id) => {
    if (window.confirm('Deseja realmente excluir este alimento?')) {
      setAlimentos(alimentos.filter(a => a.id !== id));
      mostrarMensagem('Alimento excluído com sucesso!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                🍎 Alimentos - Tabela TACO
              </h1>
              <p className="text-gray-600 mt-1">Usuário: {dadosTelaAnterior.userName}</p>
            </div>
            <button
              onClick={() => abrirModal()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
            >
              <Plus size={20} />
              Adicionar Alimento
            </button>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar alimento..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Mensagem de feedback */}
      {mensagem.texto && (
        <div className={`max-w-7xl mx-auto mb-4 p-4 rounded-xl flex items-center gap-2 animate-pulse ${
          mensagem.tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {mensagem.tipo === 'success' ? <Check size={20} /> : <X size={20} />}
          {mensagem.texto}
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Alimentos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📋 Lista de Alimentos ({alimentosFiltrados.length})
            </h2>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {alimentosFiltrados.map(alimento => (
                <div
                  key={alimento.id}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{alimento.nome_alimento}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-orange-600">🔥 {alimento.calorias} kcal</span>
                        <span className="text-blue-600">🍚 {alimento.carboidratos}g carb</span>
                        <span className="text-red-600">🥩 {alimento.proteinas}g prot</span>
                        <span className="text-yellow-600">🧈 {alimento.gorduras}g gord</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => abrirModal(alimento)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => excluirAlimento(alimento.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {alimentosFiltrados.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg">Nenhum alimento encontrado</p>
                  <p className="text-sm">Tente buscar por outro nome</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="space-y-6">
          {/* Card de Totais */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-green-500" />
              Totais Nutricionais
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-semibold text-gray-700">Calorias:</span>
                <span className="text-orange-600 font-bold">{totais.calorias.toFixed(0)} kcal</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-semibold text-gray-700">Carboidratos:</span>
                <span className="text-blue-600 font-bold">{totais.carboidratos.toFixed(1)} g</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-semibold text-gray-700">Proteínas:</span>
                <span className="text-red-600 font-bold">{totais.proteinas.toFixed(1)} g</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-semibold text-gray-700">Gorduras:</span>
                <span className="text-yellow-600 font-bold">{totais.gorduras.toFixed(1)} g</span>
              </div>
            </div>
          </div>

          {/* Gráfico de Pizza */}
          {dadosGraficoPizza.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Distribuição de Macros</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dadosGraficoPizza}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={800}
                  >
                    {dadosGraficoPizza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Gráfico de Barras - Metas */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Total vs Meta Diária</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGraficoBarras}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nutriente" angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#4ECDC4" name="Total" animationDuration={800} />
                <Bar dataKey="meta" fill="#95A5A6" name="Meta" animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {alimentoEditando ? 'Editar Alimento' : 'Adicionar Alimento'}
              </h2>
              <button
                onClick={fecharModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Alimento *</label>
                <input
                  type="text"
                  value={formData.nome_alimento}
                  onChange={(e) => setFormData({ ...formData, nome_alimento: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                  placeholder="Ex: Arroz integral"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Calorias (kcal)</label>
                  <input
                    type="number"
                    value={formData.calorias}
                    onChange={(e) => setFormData({ ...formData, calorias: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Carboidratos (g)</label>
                  <input
                    type="number"
                    value={formData.carboidratos}
                    onChange={(e) => setFormData({ ...formData, carboidratos: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Proteínas (g)</label>
                  <input
                    type="number"
                    value={formData.proteinas}
                    onChange={(e) => setFormData({ ...formData, proteinas: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gorduras (g)</label>
                  <input
                    type="number"
                    value={formData.gorduras}
                    onChange={(e) => setFormData({ ...formData, gorduras: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fibra (g)</label>
                <input
                  type="number"
                  value={formData.fibra}
                  onChange={(e) => setFormData({ ...formData, fibra: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={fecharModal}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={salvarAlimento}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AlimentosScreen;
