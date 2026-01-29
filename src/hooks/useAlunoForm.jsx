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
    const [termsAccepted, setTermsAccepted] = useState(false);


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
        setTermsAccepted(false);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Converter para WebP com redimensionamento
        if (file.type !== 'image/webp') {
            try {
                const img = new window.Image();
                const objectUrl = URL.createObjectURL(file);
                img.src = objectUrl;
                img.onload = async () => {
                    // Configurar tamanho máximo e manter proporção
                    const MAX_WIDTH = 320;
                    const MAX_HEIGHT = 640;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = Math.round((height * MAX_WIDTH) / width);
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = Math.round((width * MAX_HEIGHT) / height);
                            height = MAX_HEIGHT;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        URL.revokeObjectURL(objectUrl); // Limpa o URL antigo
                        if (blob) {
                            const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' });
                            setFoto(webpFile);
                            const previewUrl = URL.createObjectURL(blob);
                            setFotoPreview(previewUrl);
                        } else {
                            setFoto(null);
                            setFotoPreview('');
                        }
                    }, 'image/webp', 0.9);
                };
                img.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    setFoto(null);
                    setFotoPreview('');
                };
                return;
            } catch (err) {
                setFoto(null);
                setFotoPreview('');
                return;
            }
        }
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
        termsAccepted,
        setTermsAccepted
    };
};

export default useAlunoForm;