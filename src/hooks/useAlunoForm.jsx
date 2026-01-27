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

        // Converter e comprimir para WebP (qualidade ajustada)
        if (file.type !== 'image/webp') {
            try {
                const img = new window.Image();
                img.src = URL.createObjectURL(file);
                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    // Redimensiona se maior que 600px (opcional, remove se não quiser)
                    const maxDim = 600;
                    let width = img.width;
                    let height = img.height;
                    if (width > maxDim || height > maxDim) {
                        if (width > height) {
                            height = Math.round((height * maxDim) / width);
                            width = maxDim;
                        } else {
                            width = Math.round((width * maxDim) / height);
                            height = maxDim;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' });
                            setFoto(webpFile);
                            setFotoPreview(URL.createObjectURL(blob));
                        } else {
                            setFoto(file);
                            setFotoPreview(URL.createObjectURL(file));
                        }
                    }, 'image/webp', 0.7); // qualidade reduzida para 0.7
                };
                return;
            } catch (err) {
                setFoto(file);
                setFotoPreview(URL.createObjectURL(file));
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