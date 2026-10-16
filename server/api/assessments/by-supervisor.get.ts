import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const role = getCookie(event, 'role')
    const supervisorIdCookie = getCookie(event, 'supervisorId')
    let where: any
    if (role === 'superadmin') {
      // Read-only overview: all assessments, optionally filtered by ?supervisorId=
      const q = getQuery(event) as { supervisorId?: string }
      const sid = q.supervisorId ? parseInt(String(q.supervisorId)) : NaN
      where = Number.isFinite(sid) ? { supervisorId: sid } : {}
    } else {
      if (role !== 'supervisor' || !supervisorIdCookie) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
      }
      where = { supervisorId: parseInt(supervisorIdCookie) }
    }

    const assessments = await prisma.assessment.findMany({
      where,
      include: { student: true, supervisor: true },
      orderBy: { createdAt: 'desc' },
    })

    const assessmentsWithTotal = assessments.map(assessment => {
      let totalMark
      if (assessment.formType === 'ecd') {
        // For ECD: preparation + lessonPlanning (mapped from lessonFacilitation) + personalDimensions (mapped from deportment) + documents (mapped from records) + environment + community + conclusion (mapped from remainingPillars)
        totalMark = (assessment.preparationMark || 0) + 
                   (assessment.lessonPlanningMark || 0) + 
                   (assessment.personalDimensionsMark || 0) + 
                   (assessment.documentsMark || 0) + 
                   (assessment.environmentMark || 0) + 
                   (assessment.communityMark || 0) + 
                   (assessment.conclusionMark || 0)
      } else if (assessment.formType === 'junior') {
        // For Junior: preparation + lessonPlanning + personalDimensions (mapped from deportment) + documents + environment + community + conclusion (mapped from remainingPillars)
        totalMark = (assessment.preparationMark || 0) + 
                   (assessment.lessonPlanningMark || 0) + 
                   (assessment.personalDimensionsMark || 0) + 
                   (assessment.documentsMark || 0) + 
                   (assessment.environmentMark || 0) + 
                   (assessment.communityMark || 0) + 
                   (assessment.conclusionMark || 0)
      } else {
        // For other assessment types, use standard calculation
        totalMark = (assessment.preparationMark || 0) + 
                   (assessment.lessonPlanningMark || 0) + 
                   (assessment.environmentMark || 0) + 
                   (assessment.documentsMark || 0) + 
                   (assessment.introductionMark || 0) + 
                   (assessment.developmentMark || 0) + 
                   (assessment.conclusionMark || 0) + 
                   (assessment.personalDimensionsMark || 0) + 
                   (assessment.communityMark || 0)
      }
      
      return {
        ...assessment,
        totalMark: Math.min(totalMark, 100) // Cap at 100
      }
    })

    return { assessments: assessmentsWithTotal }
  } catch (error) {
    if ((error as any)?.statusCode) throw error
    console.error('Error fetching supervisor assessments:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch assessments' })
  }
})

