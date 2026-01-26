import React, { useEffect, useState } from 'react';
import { fetchInstrutores, createInstrutor, updateInstrutor } from '../services/instrutoresApi';
import { fetchGraduacoes } from '../services/alunosApi';
import useInstrutorForm from '../hooks/useInstrutorForm';
import { filterData, sortData, renderSortIndicator } from '../utils/sorting';
import SearchBar from '../components/SearchBar';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormToggle from '../components/FormToggle';

const InstrutoresDashboard = () => {
    const [instrutores, setInstrutores] = useState([]);
    const [graduacoes, setGraduacoes] = useState([]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');


    const {
        username,
        nome,
        setNome,
        is_active,
        setIsActive,
        graduacao,
        email,
        contato,
        setUsername,
        editingId,
        setEditingId,
        setGraduacao,
        setEmail,
        setContato,
        resetForm,
        password,
        setPassword,
        passwordConfirm,
        setPasswordConfirm,
    } = useInstrutorForm();

    const loadData = async () => {
        const instrutoresData = await fetchInstrutores();
        const filteredInstrutores = instrutoresData.filter(instrutor => !instrutor.is_superuser);
        setInstrutores(filteredInstrutores);
        const graduacoesData = await fetchGraduacoes();
        setGraduacoes(graduacoesData);
    };

    useEffect(() => {
        loadData();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('nome', nome);
            formData.append('email', email);
            formData.append('graduacao', graduacao);
            formData.append('contato', contato);
            formData.append('is_active', is_active);
            formData.append('password', password);

            if (editingId) {
                await updateInstrutor(editingId, formData);
            } else {
                await createInstrutor(formData);
            }

            resetForm();
            loadData();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (instrutor) => {
        setIsFormVisible(true);
        setUsername(instrutor.username);
        setIsActive(instrutor.is_active === true || instrutor.is_active === "true");
        setNome(instrutor.nome);
        setContato(instrutor.contato || '');
        setEmail(instrutor.email || '');
        setGraduacao(instrutor.graduacao || '');
        setEditingId(instrutor.id);
        setPassword(instrutor.password || '');
    };

    const toggleAtivoStatus = async (instrutor) => {
        const newStatus = !(instrutor.is_active === true || instrutor.is_active === "true");
        const formData = new FormData();
        formData.append('username', instrutor.username);
        formData.append('nome', instrutor.nome || '');
        formData.append('contato', instrutor.contato || '');
        formData.append('email', instrutor.email || '');
        formData.append('graduacao', instrutor.graduacao || '');
        formData.append('is_active', newStatus);

        await updateInstrutor(instrutor.id, formData);
        loadData();
    };

    const filteredInstrutores = filterData(instrutores, searchTerm);


    const sortedInstrutores = sortData(filteredInstrutores, sortDirection);



    return (
        <div className="p-3 sm:p-4 relative">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Instrutors</h1>
            <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 mb-4 flex items-center justify-center transition-all duration-200 shadow-md w-full sm:w-auto"
            >
                {isFormVisible ? (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span>Ocultar Formulário</span>
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <span>Mostrar Formulário</span>
                    </>
                )}
            </button>

            {isFormVisible && (
                <div className="bg-neutral-200 p-4 sm:p-6 rounded-lg shadow-md mb-6 border border-gray-200 transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">{editingId ? 'Editar Instrutor' : 'Adicionar Novo Instrutor'}</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (password !== passwordConfirm) {
                            alert("As senhas não coincidem!");
                            return;
                        }
                        handleSubmit(e);
                    }} className="space-y-4">

                        {/* Linha 1: Username e Senha */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                label="Nome de Usuário"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nome de usuário"
                                required={true}
                            />
                            <FormInput
                                label="Senha"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                            />
                        </div>

                        {/* Linha 2: Confirmação de Senha */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                label="Confirmação de Senha"
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                placeholder="Confirme a senha"
                                required={!!password}
                            />
                        </div>

                        {/* Linha 3: Nome e Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                label="Nome"
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Nome completo"
                                required={true}
                            />
                            <FormInput
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@exemplo.com"
                            />
                        </div>

                        {/* Linha 4: Contato e Graduação */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                label="Contato"
                                type="text"
                                value={contato}
                                onChange={(e) => setContato(e.target.value)}
                                placeholder="(XX) XXXXX-XXXX"
                            />
                            <FormSelect
                                label="Graduação"
                                value={graduacao}
                                onChange={(e) => setGraduacao(e.target.value)}
                                options={graduacoes}
                                placeholder="Selecione a Graduação"
                            />
                        </div>

                        {/* Linha 5: Status */}
                        <div className="flex items-end">
                            <FormToggle
                                label="Ativo"
                                value={is_active}
                                onChange={(e) => setIsActive(e)}
                                description="Ativa ou desativa o acesso do instrutor"
                            />
                        </div>

                        {/* Botões de ação */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded shadow-md transition-all duration-200 flex-1 sm:flex-none"
                            >
                                {editingId ? 'Atualizar' : 'Adicionar'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded shadow-md transition-all duration-200 flex-1 sm:flex-none"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="mb-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder='Buscar Instrutor' />
            </div>

            {/* tabela de instrutores */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center space-x-1">
                                    <span>Status</span>
                                </div>
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Username</th>

                            <th
                                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                            >
                                Nome
                                {renderSortIndicator(sortDirection)}
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Graduação</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Contato</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Email</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedInstrutores.map((instrutor) => {
                            const graduacaoObj = graduacoes.find(grad => grad.id === instrutor.graduacao);
                            const isActive = instrutor.is_active === true || instrutor.is_active === "true";

                            return (
                                <tr key={instrutor.id} className="hover:bg-gray-50 transition-all duration-200">
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={isActive}
                                                onChange={() => toggleAtivoStatus(instrutor)}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {isActive ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden sm:table-cell">{instrutor.username}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instrutor.nome}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{graduacaoObj ? graduacaoObj.faixa : 'N/A'}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{instrutor.contato}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{instrutor.email}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                        <button
                                            onClick={() => handleEdit(instrutor)}
                                            className="bg-amber-500 hover:bg-amber-600 text-white rounded px-3 py-1 transition-colors duration-200 text-sm sm:text-base"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default InstrutoresDashboard;