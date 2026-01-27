import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAlunoForm from '../hooks/useAlunoForm';
import { noLoginRequest } from '../services/baseApi';
import { registerAlunoWithToken } from '../services/alunosApi';
import FormInput from '../components/FormInput';
import FormDateInput from '../components/FormDateInput';
import FormSelect from '../components/FormSelect';
import ImageUploadPreview from '../components/ImageUploadPreview';
import ConditionalField from '../components/ConditionalField';
import TermsConditionsModal from '../components/TermsConditionsModal';
import LogoAcademia from '../components/LogoAcademia';
import Footer from '../components/Footer';

const AlunoRegister = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showTermsModal, setShowTermsModal] = useState(true);
    const [graduacoes, setGraduacoes] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [termsAcceptedByUser, setTermsAcceptedByUser] = useState(false);

    const {
        nome,
        data_nascimento,
        contato,
        email,
        foto,
        fotoPreview,
        responsavel,
        setNome,
        setDataNascimento,
        setContato,
        setEmail,
        setResponsavel,
        setTermsAccepted,
        handleFileChange,
        graduacao,
        setGraduacao,
        turma,
        setTurma,
        setDataGraduacao,
        setDataGrau,
        data_graduacao,
        data_grau,
        graus,
        setGraus,
        resetForm,
    } = useAlunoForm();


    const loadData = async () => {
        const graduacoesData = await noLoginRequest('academia/graduacoes/', 'get');
        console.log('Graduacoes data:', graduacoesData);
        setGraduacoes(graduacoesData);
        const turmasData = await noLoginRequest('academia/turmas/', 'get');
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

    const handleTermsAccept = () => {
        setTermsAcceptedByUser(true);
        setTermsAccepted(true);
        setShowTermsModal(false);
    };

    const handleTermsDecline = () => {
        window.alert('Você deve aceitar os Termos e Condições para continuar com o cadastro.');
        setTermsAcceptedByUser(false);
        setTermsAccepted(false);
        setShowTermsModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!termsAcceptedByUser) {
            setError('Você deve aceitar os Termos e Condições para continuar.');
            return;
        }

        if (!nome || !data_nascimento || !email) {
            setError('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (showResponsavel && !responsavel) {
            setError('Por favor, preencha o campo de responsável para menores de 18 anos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('data_nascimento', data_nascimento);
            formData.append('contato', contato || '');
            formData.append('email', email);
            formData.append('responsavel', responsavel || '');
            formData.append('graduacao', graduacao || '');
            formData.append('turma', turma || '');
            formData.append('data_graduacao', data_graduacao || '');
            formData.append('data_grau', data_grau || '');
            formData.append('graus', graus || '');
            formData.append('ativo', true);
            if (foto) {
                formData.append('foto', foto);
            }

            await registerAlunoWithToken(token, formData);

            // Redirecionar para página de sucesso ou login
            window.alert('Cadastro realizado com sucesso!');
            resetForm();

        } catch (err) {
            console.error('Erro ao registrar:', err);
            setError(err.message || 'Erro ao processar o cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex flex-col items-center justify-center p-4">
            <TermsConditionsModal
                isOpen={showTermsModal}
                onAccept={handleTermsAccept}
                onDecline={handleTermsDecline}
            />

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <LogoAcademia />
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                        Cadastro de Aluno
                    </h1>
                    <p className="text-gray-600 text-center mb-6">
                        Complete seu cadastro como novo aluno
                    </p>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Data de Nascimento */}
                        <FormDateInput
                            label="Data de Nascimento"
                            value={data_nascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                            colSpan="full"
                            required={true}
                        />

                        {/* Nome */}
                        <FormInput
                            label="Nome Completo"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Seu nome completo "
                            required={true}
                        />

                        {/* Campo Responsável (condicional) */}
                        <ConditionalField show={showResponsavel}>
                            <FormInput
                                label="Responsável (Menor de 18 anos) "
                                value={responsavel}
                                onChange={(e) => setResponsavel(e.target.value)}
                                placeholder="Nome do responsável"
                                required={true}
                            />
                        </ConditionalField>

                        {/* Email */}
                        <FormInput
                            label="Email "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="seu.email@exemplo.com"
                            required={true}
                        />

                        {/* Contato */}
                        <FormInput
                            label="Contato"
                            value={contato}
                            onChange={(e) => setContato(e.target.value)}
                            type="tel"
                            placeholder="(XX) XXXXX-XXXX"
                        />

                        {/*Graduacao*/}
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

                        {/*Turma*/}
                        <FormSelect
                            label="Turma"
                            value={turma}
                            onChange={(e) => setTurma(e.target.value)}
                            options={turmas}
                            placeholder="Selecione a Turma"
                        />

                        {/* Foto */}
                        <ImageUploadPreview
                            label="Foto do Perfil"
                            onFileChange={handleFileChange}
                            preview={fotoPreview}
                            accept="image/jpeg, image/png"
                        />

                        {/* Checkbox de Termos */}
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded border border-blue-200">
                            <input
                                type="checkbox"
                                id="terms-checkbox"
                                checked={termsAcceptedByUser}
                                onChange={(e) => {
                                    setTermsAcceptedByUser(e.target.checked);
                                    setTermsAccepted(e.target.checked);
                                }}
                                className="h-4 w-4 text-indigo-600 rounded cursor-pointer"
                            />
                            <label
                                htmlFor="terms-checkbox"
                                className="text-sm text-gray-700 cursor-pointer"
                            >
                                Aceito os{' '}
                                <button
                                    type="button"
                                    onClick={() => setShowTermsModal(true)}
                                    className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
                                >
                                    Termos e Condições
                                </button>
                            </label>
                        </div>

                        {/* Botões de ação */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded transition-all duration-200"
                        >
                            {loading ? 'Processando...' : 'Cadastrar'}
                        </button>


                    </form>

                </div>
                <Footer
                    developerName="Victor Kelvin"
                    githubUrl="https://github.com/victorkelvin"
                    linkedinUrl="https://linkedin.com/in/victor-kelvin"
                    whatsappUrl="https://wa.me/5561985702670"
                    sticker={true}
                />

            </div>

        </div>
    );
};

export default AlunoRegister;
