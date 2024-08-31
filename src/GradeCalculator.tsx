import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function GradeCalculator() {
  const [grades, setGrades] = useState([
    { value: 0, percentage: 25 },
    { value: 0, percentage: 25 },
    { value: 0, percentage: 25 },
    { value: 0, percentage: 25 },
  ])
  const [finalGrade, setFinalGrade] = useState(0)

  const handleGradeChange = (index: number, field: 'value' | 'percentage', newValue: number) => {
    const updatedGrades = [...grades]
    updatedGrades[index][field] = newValue
    setGrades(updatedGrades)
  }

  const calculateFinalGrade = () => {
    const total = grades.reduce((sum, grade) => sum + (grade.value * grade.percentage / 100), 0)
    setFinalGrade(total)
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">Calculadora de Notas</h1>
        {grades.map((grade, index) => (
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
              />
            </div>
          </div>
        ))}
        <Button 
          onClick={calculateFinalGrade}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
        >
          Calcular Nota Final
        </Button>
        {finalGrade > 0 && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-green-700">Nota Final</h2>
            <p className="text-3xl font-bold text-green-800">{finalGrade.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
