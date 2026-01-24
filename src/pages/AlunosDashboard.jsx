import React, { useEffect, useState, useRef } from 'react';
import { sortData, renderSortIndicator, filterData } from '../utils/sorting';
import useAlunoForm from '../hooks/useAlunoForm';
import { fetchAlunos, fetchGraduacoes, createAluno, updateAluno } from '../services/alunosApi';
import { fetchTurmas } from '../services/turmasApi';
import SearchBar from '../components/SearchBar';
import SpanCard from '../components/SpanCard';
import MultiSelect from '../components/MultiSelect';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormDateInput from '../components/FormDateInput';
import FormToggle from '../components/FormToggle';
import ImageUploadPreview from '../components/ImageUploadPreview';
import ConditionalField from '../components/ConditionalField';

const AlunosDashboard = () => {
    const [alunos, setAlunos] = useState([]);
    const [graduacoes, setGraduacoes] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [selectedAluno, setSelectedAluno] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);
    const [linkExpirationTime, setLinkExpirationTime] = useState('');

    const [selectedGraduacoes, setSelectedGraduacoes] = useState([]);
    const [selectedTurmas, setSelectedTurmas] = useState([]);

    const {
        nome,
        data_nascimento,
        contato,
        email,
        graduacao,
        graus,
        turma,
        ativo,
        foto,
        fotoPreview,
        editingId,
        setNome,
        setDataNascimento,
        setContato,
        setEmail,
        setGraduacao,
        setGraus,
        setTurma,
        setAtivo,
        setFotoPreview,
        resetForm,
        handleFileChange,
        setEditingId,
        responsavel,
        setResponsavel,
        data_graduacao,
        data_grau,
        setDataGraduacao,
        setDataGrau,
    } = useAlunoForm();

    const loadData = async () => {
        const alunosData = await fetchAlunos();
        setAlunos(await alunosData.results);
        const graduacoesData = await fetchGraduacoes();
        setGraduacoes(graduacoesData);
        const turmasData = await fetchTurmas();
        setTurmas(turmasData);
    };

    useEffect(() => {
        loadData();
    }, []);

    const calculateAge = (dob) => {
        if (!dob) return null;
        const [year, month, day] = dob.split('-').map(Number);
        const today = new Date();
        let age = today.getFullYear() - year;
        const m = today.getMonth() + 1 - month;
        const d = today.getDate() - day;
        if (m < 0 || (m === 0 && d < 0)) age--;
        return age;
    };
    const showResponsavel = data_nascimento ? calculateAge(data_nascimento) < 18 : false;

    const handleMouseEnter = (aluno, e) => {
        setSelectedAluno(aluno);

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = e.clientX + 10;
        let y = e.clientY + 10;

        setTimeout(() => {
            if (cardRef.current) {
                const cardWidth = cardRef.current.offsetWidth;
                const cardHeight = cardRef.current.offsetHeight;

                if (x + cardWidth > viewportWidth) {
                    x = e.clientX - cardWidth - 10;
                }

                if (y + cardHeight > viewportHeight) {
                    y = e.clientY - cardHeight - 10;
                }

                setCardPosition({ x, y });
            }
        }, 0);

        setCardPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setSelectedAluno(null);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('data_nascimento', data_nascimento);
            formData.append('contato', contato);
            formData.append('email', email);
            formData.append('graduacao', graduacao);
            formData.append('graus', graus);
            formData.append('turma', turma);
            formData.append('ativo', ativo);
            formData.append('responsavel', responsavel || '');
            formData.append('data_graduacao', data_graduacao || '');
            formData.append('data_grau', data_grau || '');
            if (foto) {
                formData.append('foto', foto);
            }

            if (editingId) {
                await updateAluno(editingId, formData);
            } else {
                await createAluno(formData);
            }

            resetForm();
            setResponsavel('');
            loadData();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (aluno) => {
        setIsFormVisible(true);
        setNome(aluno.nome);
        setAtivo(aluno.ativo === true || aluno.ativo === "true");
        setDataNascimento(aluno.data_nascimento);
        setContato(aluno.contato || '');
        setEmail(aluno.email || '');
        setGraduacao(aluno.graduacao || '');
        setTurma(aluno.turma || '');
        setEditingId(aluno.id);
        setFotoPreview(aluno.foto_base64 || '');
        setResponsavel(aluno.responsavel || '');
        setGraus(aluno.graus || '');
        setDataGraduacao(aluno.data_graduacao || '');
        setDataGrau(aluno.data_grau || '');
    };

    const toggleAtivoStatus = async (aluno) => {
        const newStatus = !(aluno.ativo === true || aluno.ativo === "true");
        const formData = new FormData();
        formData.append('ativo', newStatus);
        formData.append('nome', aluno.nome);
        formData.append('data_nascimento', aluno.data_nascimento || '');
        formData.append('contato', aluno.contato || '');
        formData.append('email', aluno.email || '');
        formData.append('graduacao', aluno.graduacao || '');
        formData.append('graus', aluno.graus || '');
        formData.append('turma', aluno.turma || '');
        formData.append('responsavel', aluno.responsavel || '');
        formData.append('data_graduacao', aluno.data_graduacao || '');
        formData.append('data_grau', aluno.data_grau || '');
        if (aluno.foto_file) {
            formData.append('foto', aluno.foto_file);
        }

        await updateAluno(aluno.id, formData);
        loadData();
    };

    const filteredAlunos = filterData(alunos, searchTerm).filter((a) => {
        const gradId = a.graduacao != null ? String(a.graduacao) : '';
        const turmaId = a.turma != null ? String(a.turma) : '';

        const gradOk = selectedGraduacoes.length === 0 || selectedGraduacoes.includes(gradId);
        const turmaOk = selectedTurmas.length === 0 || selectedTurmas.includes(turmaId);
        return gradOk && turmaOk;
    });
    const sortedAlunos = sortData(filteredAlunos, sortDirection);


    const graduacaoOptions = graduacoes.map(g => ({ value: String(g.id), label: g.faixa }));
    const turmaOptions = turmas.map(t => ({ value: String(t.id), label: t.nome }));

    return (
        <div className="w-dvw p-3 sm:p-4 relative">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Alunos</h1>

            {/* Seção de Botões */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4'>
                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="bg-indigo-600 hover:bg-indigo-800 text-white rounded px-4 py-2 flex items-center justify-center transition-all duration-200 shadow-md w-full sm:w-auto"
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

                <div className='flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-end'>
                    <input
                        type="number"
                        min="1"
                        placeholder="Horas"
                        value={linkExpirationTime}
                        onChange={(e) => setLinkExpirationTime(e.target.value)}
                        className="border rounded p-2 w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-center"
                    />
                    <button
                        className='bg-yellow-500 hover:bg-yellow-400 text-white rounded px-4 py-2 flex items-center justify-center transition-all duration-200 shadow-md whitespace-nowrap w-full sm:w-auto'
                    >
                        Gerar Link
                    </button>
                </div>
            </div>



            {isFormVisible && (
                <div className="bg-neutral-200 p-4 sm:p-6 rounded-lg shadow-md mb-6 border border-gray-200 transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">{editingId ? 'Editar Aluno' : 'Adicionar Novo Aluno'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Linha 1: Data de Nascimento e Nome */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormDateInput
                                label="Data de Nascimento"
                                value={data_nascimento}
                                onChange={(e) => setDataNascimento(e.target.value)}
                                colSpan="1"
                            />
                            <div className="sm:col-span-2">
                                <FormInput
                                    label="Nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Nome do Aluno"
                                    required={true}
                                />
                            </div>
                        </div>

                        {/* Campo Responsável (condicional) */}
                        <ConditionalField show={showResponsavel}>
                            <FormInput
                                label="Responsável (Aluno menor de 18)"
                                value={responsavel}
                                onChange={(e) => setResponsavel(e.target.value)}
                                placeholder="Nome do responsável"
                                required={true}
                            />
                        </ConditionalField>

                        {/* Linha 2: Contato e Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                label="Contato"
                                value={contato}
                                onChange={(e) => setContato(e.target.value)}
                                type="text"
                                placeholder="(XX) XXXXX-XXXX"
                            />
                            <FormInput
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="email@exemplo.com"
                            />
                        </div>

                        {/* Linha 3: Graduação, Graus e Turma */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <FormSelect
                                    label="Graduação"
                                    value={graduacao}
                                    onChange={(e) => setGraduacao(e.target.value)}
                                    options={graduacoes}
                                    placeholder="Selecione a Graduação"
                                />
                                <FormDateInput
                                    label="Data da última graduação"
                                    value={data_graduacao}
                                    onChange={(e) => setDataGraduacao(e.target.value)}
                                    colSpan="1"
                                />
                            </div>

                            <div>
                                <FormInput
                                    label="Graus"
                                    value={graus}
                                    onChange={(e) => setGraus(e.target.value === '' ? '' : Number(e.target.value))}
                                    type="number"
                                    placeholder="0-4"
                                />
                                <FormDateInput
                                    label="Data do último grau"
                                    value={data_grau}
                                    onChange={(e) => setDataGrau(e.target.value)}
                                    colSpan="1"
                                />
                            </div>

                            <FormSelect
                                label="Turma"
                                value={turma}
                                onChange={(e) => setTurma(e.target.value)}
                                options={turmas}
                                placeholder="Selecione a Turma"
                            />
                        </div>

                        {/* Linha 4: Foto e Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ImageUploadPreview
                                label="Foto"
                                onFileChange={handleFileChange}
                                preview={fotoPreview}
                                accept="image/jpeg, image/png"
                            />
                        </div>
                        <div className="flex">
                            <FormToggle
                                label="Aluno Ativo"
                                value={ativo}
                                onChange={(e) => setAtivo(e)}
                                description="Ativa ou desativa o acesso do aluno"
                            />

                        </div>

                        {/* Botões de ação */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded shadow-md transition-all duration-200 flex-1 sm:flex-none"
                            >
                                {editingId ? 'Atualizar' : 'Adicionar'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { resetForm(); }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded shadow-md transition-all duration-200 flex-1 sm:flex-none"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}


            {/* Tabela de alunos */}
            <div className="mb-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder='Buscar Aluno' />
            </div>

            {/* Filtros por Graduação e Turma */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="md:col-span-1">
                    <MultiSelect
                        label={"Graduações"}
                        options={graduacaoOptions}
                        value={graduacaoOptions.filter(opt => selectedGraduacoes.includes(opt.value))}
                        onChange={(selectedOptions) => {
                            if (!selectedOptions) {
                                setSelectedGraduacoes([]);
                                return;
                            }
                            setSelectedGraduacoes(selectedOptions.map(o => String(o.value)));
                        }}
                        placeholder="Selecione as graduações..."
                    />
                </div>

                <div className="md:col-span-1">
                    <MultiSelect
                        label={"Turmas"}
                        options={turmaOptions}
                        value={turmaOptions.filter(opt => selectedTurmas.includes(opt.value))}
                        onChange={(selectedOptions) => {
                            if (!selectedOptions) {
                                setSelectedTurmas([]);
                                return;
                            }
                            setSelectedTurmas(selectedOptions.map(o => String(o.value)));
                        }}
                        placeholder="Selecione as Turmas..."
                    />
                </div>

                <div className="flex items-end md:col-span-1">
                    <button
                        type="button"
                        onClick={() => { setSelectedGraduacoes([]); setSelectedTurmas([]); }}
                        className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded shadow-md transition-all duration-200 h-auto"
                    >
                        Limpar filtros
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center space-x-1">
                                    <span>Status</span>
                                </div>
                            </th>

                            <th
                                className={`px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100`}
                                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Nome</span>
                                    {renderSortIndicator(sortDirection)}
                                </div>
                            </th>
                            <th
                                className={`px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden sm:table-cell`}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Graduação</span>
                                </div>
                            </th>
                            <th
                                className={`px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 hidden md:table-cell`}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Turma</span>
                                </div>
                            </th>
                            <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedAlunos.map((aluno) => {
                            const graduacaoObj = graduacoes.find(grad => grad.id === aluno.graduacao);
                            const turmaObj = turmas.find(turma => turma.id === aluno.turma);
                            const isAtivo = aluno.ativo === true || aluno.ativo === "true";

                            return (
                                <tr
                                    key={aluno.id}
                                    onMouseEnter={(e) => handleMouseEnter(aluno, e)}
                                    onMouseLeave={handleMouseLeave}
                                    className={`hover:bg-gray-50 ${!isAtivo ? 'bg-gray-50' : ''}`}
                                >
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={isAtivo}
                                                onChange={() => toggleAtivoStatus(aluno)}
                                                className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out cursor-pointer"
                                            />
                                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAtivo
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {isAtivo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{aluno.nome}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{graduacaoObj ? graduacaoObj.faixa : 'N/A'}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{turmaObj ? turmaObj.nome : 'N/A'}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                        <button
                                            onClick={() => { handleEdit(aluno) }}
                                            className="bg-amber-500 hover:bg-amber-600 text-white rounded px-3 py-1 transition-colors duration-200 text-sm sm:text-base"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {
                selectedAluno && (
                    <SpanCard data={selectedAluno} position={cardPosition} setCardPosition={setCardPosition} />
                )
            }
        </div >
    );
};

export default AlunosDashboard;