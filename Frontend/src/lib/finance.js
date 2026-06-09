export function calculateLessonFinance(lesson) {
  if (lesson.gratuito) {
    return { gross: 0, commission: 0 }
  }

  const gross = Number(lesson.valor || 0) * Number(lesson.totalVendas || 0)

  return {
    gross,
    commission: Number((gross * 0.7).toFixed(2)),
  }
}
