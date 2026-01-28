import { apiRequest, apiFormDataRequest, noLoginRequest } from './baseApi';

const alunosEndpoint = 'academia/alunos/';
const graduacoesEndpoint = 'academia/graduacoes/';
const registrationEndpoint = 'academia/alunos/generate_invitation/';
const validateInvitationEndpoint = 'academia/alunos/validate_invitation/';

export const fetchAlunos = async () => {
    return await apiRequest(alunosEndpoint, 'get');
};

export const fetchGraduacoes = async () => {
    return await apiRequest(graduacoesEndpoint, 'get');
};

export const createAluno = async (formData) => {
    return await apiFormDataRequest(alunosEndpoint, 'post', formData);
};

export const updateAluno = async (id, formData) => {
    return await apiFormDataRequest(`${alunosEndpoint}${id}/`, 'put', formData);
};

export const generateRegistrationLink = async (expirationHours = 24) => {
    return await apiRequest(`${registrationEndpoint}?hours=${expirationHours}`, 'post');
};

export const registerAlunoWithToken = async (token, formData) => {
    return await noLoginRequest(`${alunosEndpoint}?token=${token}`, 'post', formData);
};

export const validateRegistrationToken = async (token) => {
    return await noLoginRequest(`${validateInvitationEndpoint}?token=${token}`, 'get');
}

export const fetchAlunoById = async (id) => {
    return await apiRequest(`${alunosEndpoint}${id}/`, 'get');
};