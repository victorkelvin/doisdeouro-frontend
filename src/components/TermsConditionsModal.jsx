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
                                <li>Respeitar as normas e regulamentos da academia</li>
                                <li>Comunicar qualquer alteração nos dados cadastrais</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mt-4 mb-2">3. Consentimento de Imagem</h3>
                            <p>
                                Por meio deste instrumento consinto a utilização de minha imagem em mídia jornalística e outros meio que venham a cobrir os treinamentos,
                                torneios e quaisquer outras atividades relacionadas à Academia Dois de Ouro de Jiu-Jitsu,
                                e que também poderão ser gravados em vídeo, exibidos on-line, ou outra forma para públicos ao redor do mundo.
                                Concordo ter minha pessoa mostrada, divulgada, comentada e/ou relatada, e não espero receber,
                                e de fato renuncio a quaisquer direitos e compensações aos quais eu poderia ter direito como resultado.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mt-4 mb-2">4. Ciência de Risco</h3>
                            <p>
                                Declaro, ao me matricular e participar das atividades da Academia Dois de Ouro de Jiu-Jitsu que estou ciente das condições e dos riscos associados à prática do jiu-jitsu
                                e de outras atividades físicas oferecidas pela academia.Compreendo que as atividades físicas, especialmente o jiu-jitsu, envolvem riscos de lesões, como contusões, torções,
                                fraturas e outros danos corporais, e assumo total responsabilidade por minha saúde e integridade física durante a prática.
                                Declaro que estou em boas condições de saúde para participar dessas atividades e que, caso tenha alguma condição médica preexistente, como problemas cardíacos, articulares ou outras restrições, informarei a equipe da academia para que as devidas precauções sejam tomadas.
                                Estou ciente de que a academia não se responsabiliza por acidentes ou lesões ocorridas durante o treinamento, competições ou eventos promovidos pela instituição e que, em caso de lesão ou necessidade de atendimento médico, serei o único responsável pelos custos e decisões relacionadas ao tratamento e recuperação.
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
