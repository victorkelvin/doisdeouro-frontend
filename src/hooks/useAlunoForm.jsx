import { useState } from 'react';

const useAlunoForm = () => {
    const [nome, setNome] = useState('');
    const [data_nascimento, setDataNascimento] = useState('');
    const [contato, setContato] = useState('');
    const [email, setEmail] = useState('');
    const [graduacao, setGraduacao] = useState('');
    const [turma, setTurma] = useState('');
    const [ativo, setAtivo] = useState(true);
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [graus, setGraus] = useState('');
    const [responsavel, setResponsavel] = useState('');
    const [data_graduacao, setDataGraduacao] = useState('');
    const [data_grau, setDataGrau] = useState('');

    const resetForm = () => {
        setNome('');
        setDataNascimento('');
        setContato('');
        setEmail('');
        setGraduacao('');
        setTurma('');
        setEditingId(null);
        setFoto(null);
        setFotoPreview('');
        setAtivo(true);
        setGraus('');
        setResponsavel('');
        setDataGraduacao('');
        setDataGrau('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFoto(file);
        setFotoPreview(URL.createObjectURL(file));
    };

    return {
        nome,
        data_nascimento,
        contato,
        email,
        graduacao,
        turma,
        ativo,
        foto,
        fotoPreview,
        setFotoPreview,
        editingId,
        setNome,
        setDataNascimento,
        setContato,
        setEmail,
        setGraduacao,
        setTurma,
        setAtivo,
        resetForm,
        handleFileChange,
        setEditingId,
        graus,
        setGraus,
        responsavel,
        setResponsavel,
        data_graduacao,
        data_grau,
        setDataGraduacao,
        setDataGrau,
    };
};

export default useAlunoForm;