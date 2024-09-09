import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from 'lucide-react'

// Define una interfaz para los objetos de 'grades'
interface Grade {
  value: number;
  percentage: number;
  topic: string;
}

export default function Component() {
  const [subject, setSubject] = useState<'Física' | 'Matemáticas' | 'Química' | ''>('')
  const [grades, setGrades] = useState<Grade[]>([])
  const [finalGrade, setFinalGrade] = useState(0)
  const [averageGrade, setAverageGrade] = useState(0)

  // Temas por materia
  const topics: { [key in 'Física' | 'Matemáticas' | 'Química']: string[] } = {
    Física: ['Cinemática', 'Dinámica', 'Trabajo y Energía', 'Cantidad de movimiento', 'Gravitación Universal'],
    Matemáticas: ['Álgebra Lineal', 'Funciones y Gráficas', 'Límites y Continuidad', 'Derivadas', 'Integral Definida e Indefinida'],
    Química: ['Estructura Atómica', 'Enlaces Químicos', 'Estados de la Materia', 'Reacciones Químicas', 'Estequiometría']
  }

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
      setGrades([...grades, { value: 0, percentage: 0, topic: '' }])
    }
  }

  const removeNote = (index: number) => {
    const updatedGrades = grades.filter((_, i) => i !== index)
    setGrades(updatedGrades)
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
  }

  const handleSubjectChange = (newSubject: 'Física' | 'Matemáticas' | 'Química' | '') => {
    // Limpia los valores de las notas cuando cambia la materia
    setGrades([])
    setSubject(newSubject)
  }

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
