import { useState,useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from 'lucide-react'
import Modal from 'react-modal';


// Define una interfaz para los objetos de 'grades'
interface Grade {
  value: number;
  percentage: number;
  topic: string;  
}
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '500px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

export default function Component() {
  const [subject, setSubject] = useState<'Física' | 'Matemáticas' | 'Química' | ''>('')
  const [grades, setGrades] = useState<{ value: number; percentage: number; topic: string }[]>([])
  const [finalGrade, setFinalGrade] = useState(0)
  const [averageGrade, setAverageGrade] = useState(0)
  const [recommendations, setRecommendations] = useState(''); // Para mostrar las recomendaciones
  const [loading, setLoading] = useState(false); // Para indicar cuando la API está cargando
  const [error, setError] = useState(''); // Para mostrar un error si la API falla
  const [isFinalGradeCalculated, setIsFinalGradeCalculated] = useState(false); // Controla si la nota final ha sido calculada
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado para controlar la apertura del modal
  const [modalContent, setModalContent] = useState(''); // Contenido del modal



  useEffect(() => {
    // Cargar datos desde el local storage
    const storedData = localStorage.getItem('appData');
    if (storedData) {
      const { savedSubject, savedGrades } = JSON.parse(storedData);
      setSubject(savedSubject);
      setGrades(savedGrades);
    }
  }, []);

  // Temas por materia
  const topics: { [key in 'Física' | 'Matemáticas' | 'Química']: string[] } = {
    Física: ['Cinemática', 'Dinámica', 'Trabajo y Energía', 'Cantidad de movimiento', 'Gravitación Universal'],
    Matemáticas: ['Álgebra Lineal', 'Funciones y Gráficas', 'Límites y Continuidad', 'Derivadas', 'Integral Definida e Indefinida'],
    Química: ['Estructura Atómica', 'Enlaces Químicos', 'Estados de la Materia', 'Reacciones Químicas', 'Estequiometría']
  }

  const recommendationsByTopic: { [key in 'Física' | 'Matemáticas' | 'Química']: { [key: string]: string } } = {
    Física: {
      'Cinemática': 'Revisa los conceptos de velocidad y aceleración, realiza ejercicios prácticos sobre movimiento rectilíneo uniforme y acelerado.',
      'Dinámica': 'Estudia las leyes de Newton y sus aplicaciones, practica con problemas de fuerza y movimiento.',
      'Trabajo y Energía': 'Comprende la relación entre trabajo, energía y potencia, y realiza ejercicios sobre conservación de la energía.',
      'Cantidad de movimiento': 'Estudia la conservación del momento y las colisiones, realiza problemas prácticos sobre impacto.',
      'Gravitación Universal': 'Revisa la ley de gravitación universal y sus aplicaciones, realiza ejercicios sobre órbitas y campos gravitatorios.',
    },
    Matemáticas: {
      'Álgebra Lineal': 'Practica operaciones con matrices y vectores, estudia sistemas de ecuaciones y su resolución.',
      'Funciones y Gráficas': 'Revisa las propiedades de funciones y sus gráficos, realiza ejercicios sobre transformaciones de funciones.',
      'Límites y Continuidad': 'Estudia los conceptos de límites y continuidad de funciones, realiza problemas prácticos sobre cálculo de límites.',
      'Derivadas': 'Comprende las reglas de derivación y sus aplicaciones, practica con problemas de optimización y tasas de cambio.',
      'Integral Definida e Indefinida': 'Estudia las técnicas de integración y sus aplicaciones, realiza ejercicios sobre áreas bajo curvas y problemas de integración.',
    },
    Química: {
      'Estructura Atómica': 'Revisa los modelos atómicos y la configuración electrónica, realiza ejercicios sobre estructuras de átomos y moléculas.',
      'Enlaces Químicos': 'Estudia los tipos de enlaces (iónico, covalente, metálico) y sus propiedades, realiza problemas sobre formación de compuestos.',
      'Estados de la Materia': 'Comprende los estados de la materia y sus cambios, realiza ejercicios sobre fases y transiciones de fase.',
      'Reacciones Químicas': 'Revisa tipos de reacciones y balanceo de ecuaciones químicas, realiza ejercicios sobre cinética y equilibrio químico.',
      'Estequiometría': 'Estudia las relaciones cuantitativas en las reacciones químicas, realiza problemas sobre cantidades de reactivos y productos.',
    }
  };

  const handleGradeChange = (index: number, field: keyof Grade, newValue: number | string) => {
    const updatedGrades = [...grades]

    // Asegúrate de que el valor es válido para 'value'
    if (field === 'value' && typeof newValue === 'number' && newValue < 0) {
      alert('La nota no puede ser negativa')
      return
    }

    // Actualiza el campo específico
    updatedGrades[index] = { ...updatedGrades[index], [field]: newValue }
    setGrades(updatedGrades)
  }

  const addNote = () => {
    if (subject) {
      const newGrades = [...grades, { value: 0, percentage: 0, topic: '' }];
      setGrades(newGrades);
      saveToLocalStorage(subject, newGrades);
    }
  }

  const removeNote = (index: number) => {
    const updatedGrades = grades.filter((_, i) => i !== index);
    setGrades(updatedGrades);
    saveToLocalStorage(subject, updatedGrades);
  }

  const saveToLocalStorage = (subject: string | undefined, grades: { value: number; percentage: number; topic: string }[]) => {
    const data = { savedSubject: subject, savedGrades: grades };
    localStorage.setItem('appData', JSON.stringify(data));
  }


  const calculateFinalGrade = () => {
    // Verifica que todos los temas estén seleccionados
    if (grades.some(grade => grade.topic === '')) {
      alert("Todos los temas deben estar seleccionados")
      return
    }

    const totalPercentage = grades.reduce((sum, grade) => sum + grade.percentage, 0)
    if (totalPercentage !== 100) {
      alert("El porcentaje total debe ser igual al 100%")
      return
    }
    const total = grades.reduce((sum, grade) => sum + (grade.value * grade.percentage / 100), 0)
    setFinalGrade(total)

    const average = grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length
    setAverageGrade(average)
    setIsFinalGradeCalculated(true);

  }

  const handleSubjectChange = (newSubject: 'Física' | 'Matemáticas' | 'Química' | '') => {
    // Limpia los valores de las notas cuando cambia la materia
    setGrades([])
    setSubject(newSubject)
    setIsFinalGradeCalculated(false);

  }



  const handlePrompt = async () => {
    /*setLoading(true);
    setError(''); // Limpiar cualquier error previo
    setModalContent(''); // Limpiar contenido previo del modal
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const prompt = `¿Cómo mejorar mis notas en ${subject}? Aquí están mis calificaciones: ${grades.map(g => `${g.topic}: ${g.value}/5`).join(', ')}`;

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 0
      })
    };

    setLoading(true);
    setError('');

    try {
      const response = await fetch(apiUrl, requestOptions);
      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }
      const data = await response.json();
      setRecommendations(data.choices[0].message.content);
      setModalContent(data.choices[0].message.content); // Mostrar las recomendaciones en el modal

      setModalIsOpen(true); // Abre el modal con la respuesta

    } catch (error) {
      console.error(error);
      setError('Error al consultar la API. Asegúrate de que tu cuota esté activa.');
      setModalContent('Error al consultar la API. Asegúrate de que tu cuota esté activa.'); // Mostrar error en el modal
    } finally {
      setLoading(false);
      setModalIsOpen(true); // Abre el modal con el contenido

    }*/
      if (finalGrade === 0) {
        alert("Debes calcular primero tu nota final para obtener recomendaciones.");
        return;
      }
  
      if (subject === '') {
        alert("Debes seleccionar una materia para obtener recomendaciones.");
        return;
      }
  
      setRecommendations('');
      setModalIsOpen(true); // Abre el modal con el contenido
  
      // Generar recomendaciones predeterminadas
      const recommendationsList = recommendationsByTopic[subject];
      const recommendationsText = grades.map(grade => 
        `${grade.topic}: ${recommendationsList[grade.topic] || 'No hay recomendaciones disponibles.'}`
      ).join('\n');
  
      setModalContent(recommendationsText);

  };


  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">Calculadora de Notas</h1>
        
        {/* Menú desplegable para seleccionar materia */}
        <div className="mb-6">
          <Label htmlFor="subject-select" className="text-sm font-medium text-green-600">Selecciona la materia</Label>
          <select 
            id="subject-select"
            value={subject}
            onChange={(e) => handleSubjectChange(e.target.value as 'Física' | 'Matemáticas' | 'Química' | '')}
            className="mt-1 w-full border-green-300 focus:border-green-500 focus:ring-green-500"
          >
            <option value="">Selecciona una materia</option>
            <option value="Física">Física</option>
            <option value="Matemáticas">Matemáticas</option>
            <option value="Química">Química</option>
          </select>
        </div>

        {/* Sección de notas con temas dependiendo de la materia */}
        {subject && grades.map((grade, index) => (
          <div key={index} className="mb-4 flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor={`grade-${index}`} className="text-sm font-medium text-green-600">
                Nota {index + 1}
              </Label>
              <Input
                id={`grade-${index}`}
                type="number"
                value={grade.value}
                onChange={(e) => handleGradeChange(index, 'value', parseFloat(e.target.value) || 0)}
                className="mt-1 border-green-300 focus:border-green-500 focus:ring-green-500"
                disabled={!subject}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor={`percentage-${index}`} className="text-sm font-medium text-green-600">
                Porcentaje
              </Label>
              <Input
                id={`percentage-${index}`}
                type="number"
                value={grade.percentage}
                onChange={(e) => handleGradeChange(index, 'percentage', parseFloat(e.target.value) || 0)}
                className="mt-1 border-green-300 focus:border-green-500 focus:ring-green-500"
                disabled={!subject}
              />
            </div>

            {/* Menú desplegable de temas basado en la materia seleccionada */}
            <div className="flex-1">
              <Label htmlFor={`topic-${index}`} className="text-sm font-medium text-green-600">
                Tema
              </Label>
              <select
                id={`topic-${index}`}
                value={grade.topic}
                onChange={(e) => handleGradeChange(index, 'topic', e.target.value)}
                className="mt-1 w-full border-green-300 focus:border-green-500 focus:ring-green-500"
                disabled={!subject}
              >
                <option value="">Selecciona un tema</option>
                {topics[subject]?.map((topic, topicIndex) => (
                  <option key={topicIndex} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            {grades.length > 1 && (
              <Button
                onClick={() => removeNote(index)}
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        
        <div className="flex justify-between mt-6">
          <Button 
            onClick={addNote}
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50"
            disabled={!subject}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Añadir Nota
          </Button>
          <Button 
            onClick={calculateFinalGrade}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={!subject}
          >
            Calcular Nota Final
          </Button>
        </div>

 {/* Botón para mejorar las notas */}
 <div className="mt-6">
          <Button 
            onClick={handlePrompt} 
            className="bg-green-600 hover:bg-green-700 text-white w-full"
            disabled={!subject || loading||  !isFinalGradeCalculated}
          >
            {loading ? 'Cargando...' : '¿Cómo mejorar mis notas?'}
          </Button>
        </div>
        <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Recomendaciones de Mejora"
        ariaHideApp={false}
        style={customStyles} // Aplicar estilos personalizados

      >
    <h2>{error ? 'Error' : 'Recomendaciones para Mejorar tus Notas'}</h2>
    <p>{modalContent}</p>
        <Button onClick={() => setModalIsOpen(false)}>Cerrar</Button>
      </Modal>
      {error && <p style={{ color: 'red' }}>{error}</p>}


        {finalGrade > 0 && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-green-700">Nota Final</h2>
            <p className="text-3xl font-bold text-green-800">{finalGrade.toFixed(2)}</p>
          </div>
        )}
        {averageGrade > 0 && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-green-700">Promedio de Notas</h2>
            <p className="text-3xl font-bold text-green-800">{averageGrade.toFixed(2)}</p>
          </div>
        )}


      </div>
    </div>
  )
}
