import React from 'react';

const TermsConditionsModal = ({ isOpen, onAccept, onDecline }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Termos e Condições</h2>
                    
                    <div className="prose prose-sm max-w-none text-gray-700 space-y-4 mb-6">
                        <p>
                            Bem-vindo! Para completar seu cadastro, é necessário que você leia e aceite os seguintes termos e condições.
                        </p>
                        
                        <div>
                            <h3 className="font-semibold text-gray-800 mt-4 mb-2">1. Política de Privacidade</h3>
                            <p>
                                Seus dados pessoais serão utilizados exclusivamente para fins de gestão acadêmica e comunicação relacionada ao seu progresso nos cursos.
                                Não compartilharemos suas informações com terceiros sem sua autorização.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mt-4 mb-2">2. Responsabilidades do Aluno</h3>
                            <p>
                                Como aluno registrado, você concorda em:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Fornecer informações precisas e atualizadas</li>
                                <li>Manter a confidencialidade de sua senha de acesso</li>
                                <li>Respeitar as normas e regulamentos da academia</li>
                                <li>Comunicar qualquer alteração nos dados cadastrais</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mt-4 mb-2">3. Consentimento de Imagem</h3>
                            <p>
                                Você autoriza a academia a utilizar sua foto de perfil para fins administrativos e educacionais dentro da plataforma.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4. Limitações de Responsabilidade</h3>
                            <p>
                                A academia não é responsável por qualquer dano direto ou indireto resultante do uso inadequado da plataforma.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mt-4 mb-2">5. Modificações dos Termos</h3>
                            <p>
                                Reservamos o direito de modificar estes termos a qualquer momento. Você será notificado sobre mudanças significativas.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onDecline}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition-all duration-200"
                        >
                            Recusar
                        </button>
                        <button
                            onClick={onAccept}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-all duration-200"
                        >
                            Aceitar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditionsModal;
