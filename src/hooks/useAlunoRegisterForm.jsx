import { useState } from 'react';

const useAlunoRegisterForm = () => {
    const [nome, setNome] = useState('');
    const [data_nascimento, setDataNascimento] = useState('');
    const [contato, setContato] = useState('');
    const [email, setEmail] = useState('');
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState('');
    const [responsavel, setResponsavel] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setNome('');
        setDataNascimento('');
        setContato('');
        setEmail('');
        setFoto(null);
        setFotoPreview('');
        setResponsavel('');
        setTermsAccepted(false);
    };

    return {
        nome,
        data_nascimento,
        contato,
        email,
        foto,
        fotoPreview,
        responsavel,
        termsAccepted,
        setNome,
        setDataNascimento,
        setContato,
        setEmail,
        setFotoPreview,
        setResponsavel,
        setTermsAccepted,
        handleFileChange,
        resetForm,
    };
};

export default useAlunoRegisterForm;
