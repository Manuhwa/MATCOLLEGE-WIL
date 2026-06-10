import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Test database connection first
    await prisma.$connect()
    
    // Only supervisors may create assessments
    const role = getCookie(event, 'role')
    if (role !== 'supervisor') {
      throw createError({ statusCode: 401, statusMessage: 'Only supervisors may create assessments' })
    }
    const supervisorIdCookie = getCookie(event, 'supervisorId')
    const supervisorId = parseInt(String(supervisorIdCookie || '0'))
    if (!supervisorId) {
      throw createError({ statusCode: 401, statusMessage: 'Missing supervisor session' })
    }
    const body = await readBody(event)
    
    console.log('Creating assessment with data:', {
      role,
      supervisorId,
      studentId: body.studentId,
      subject: body.subject,
      topic: body.topic,
      formType: body.formType
    })
    
    // Validate required fields
    if (!body.studentId || !body.subject || !body.topic) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: studentId, subject, topic'
      })
    }

    // Idempotency: if this submission was already synced (e.g. retried from the
    // offline queue), return the existing record instead of creating a duplicate
    const clientUuid = body.clientUuid ? String(body.clientUuid) : null
    if (clientUuid) {
      const existing = await prisma.assessment.findUnique({
        where: { clientUuid },
        include: { student: true, supervisor: true }
      })
      if (existing) {
        return { message: 'Assessment already synced', assessment: existing, duplicate: true }
      }
    }

    // Map materials crit totals into existing schema fields for consistent totals and comments
    const isMaterials = body.formType === 'materials'
    const isECDStyle = ['ecd','junior','secondary','isen'].includes(String(body.formType))
    const toInt = (v: any) => Number.isFinite(parseInt(v)) ? parseInt(v) : 0
    const clamp = (val: number, max: number) => {
      const n = Number(val) || 0
      if (n < 0) return 0
      return n > max ? max : n
    }
    const data: any = {
      assessmentDate: new Date(body.assessmentDate || new Date()),
      subject: body.subject,
      topic: body.topic,
      // Default fields (standard schema names)
      preparationMark: clamp(toInt(body.preparationMark), 20),
      preparationComment: body.preparationComment || '',
      lessonPlanningMark: clamp(toInt(body.lessonPlanningMark), 20),
      lessonPlanningComment: body.lessonPlanningComment || '',
      environmentMark: clamp(toInt(body.environmentMark), 10),
      environmentComment: body.environmentComment || '',
      documentsMark: clamp(toInt(body.documentsMark), 10),
      documentsComment: body.documentsComment || '',
      introductionMark: 0, // Will be set by specific assessment type mapping
      introductionComment: '',
      developmentMark: 0, // Will be set by specific assessment type mapping
      developmentComment: '',
      conclusionMark: clamp(toInt(body.conclusionMark), 3),
      conclusionComment: body.conclusionComment || '',
      personalDimensionsMark: clamp(toInt(body.personalDimensionsMark), 4),
      personalDimensionsComment: body.personalDimensionsComment || '',
      communityMark: clamp(toInt(body.communityMark), 20),
      communityComment: body.communityComment || '',
      selectedResearchCategory: body.selectedResearchCategory || null,
      formType: (['ecd','junior','secondary','isen','materials'].includes(String(body.formType)) ? String(body.formType) : 'junior'),
      overallComment: body.overallComment || '',
      clientUuid: clientUuid,
      supervisorId: supervisorId,
      studentId: parseInt(body.studentId)
    }

    if (isMaterials) {
      // Derive category totals from materials fields sent by the client
      const contentTotal = (parseInt(body.contentTotalMark) || 0)
      const pedagogicalTotal = (parseInt(body.pedagogicalTotalMark) || 0)
      const designTotal = (parseInt(body.designTotalMark) || 0)
      const innovationTotal = (parseInt(body.innovationTotalMark) || 0)
      const educationTotal = (parseInt(body.educationTotalMark) || 0)

      // Map five buckets into existing 8 fields to preserve overall total
      data.preparationMark = contentTotal
      data.lessonPlanningMark = pedagogicalTotal
      data.environmentMark = designTotal
      data.documentsMark = innovationTotal
      data.introductionMark = educationTotal
      // Zero out unused buckets for materials context
      data.developmentMark = 0
      data.conclusionMark = 0
      data.personalDimensionsMark = 0
      data.communityMark = 0

      // Aggregate per-category comments into respective comment fields
      const join = (arr: string[]) => arr.filter(Boolean).join(' | ')
      data.preparationComment = join([body.contentRelevanceComment, body.contentOrganizationComment]) || ''
      data.lessonPlanningComment = join([body.pedagogicalAlignmentComment, body.pedagogicalEngagementComment, body.pedagogicalConnectionComment, body.pedagogicalInclusiveComment]) || ''
      data.environmentComment = join([body.designVisualComment, body.designNavigationComment, body.designQualityComment, body.designConsistencyComment]) || ''
      data.documentsComment = join([body.innovationOriginalityComment, body.innovationTechnologyComment]) || ''
      data.introductionComment = join([body.educationLocalComment, body.educationHeritageComment, body.educationProblemComment, body.educationCommercialComment]) || ''
      data.developmentComment = ''
      data.conclusionComment = ''
      data.personalDimensionsComment = ''
      data.communityComment = ''
    } else if (isECDStyle) {
      // Map ECD/Junior-style fields if provided to standard schema slots, with server-side clamping
      // Frontend uses: preparationMark(15), lessonPlanningMark(15), deportmentMark(5), documentsMark(15), environmentMark(10), communityMark(30), remainingPillarsMark(10)
      const hasECDFields = (
        body.lessonPlanningMark !== undefined ||
        body.lessonFacilitationMark !== undefined ||
        body.deportmentMark !== undefined ||
        body.documentsMark !== undefined ||
        body.recordsMark !== undefined ||
        body.remainingPillarsMark !== undefined
      )
      
      // Debug: Log ECD field detection
      console.log('ECD Field Detection:', {
        formType: body.formType,
        hasECDFields,
        lessonFacilitationMark: body.lessonFacilitationMark,
        lessonFacilitationComment: body.lessonFacilitationComment,
        recordsMark: body.recordsMark,
        recordsComment: body.recordsComment,
        preparationMark: body.preparationMark,
        preparationComment: body.preparationComment
      })
      if (hasECDFields) {
        // Direct mapping with proper clamping to original maximum values
        data.preparationMark = clamp(toInt(body.preparationMark), 15)
        data.preparationComment = body.preparationComment || data.preparationComment

        // Handle both lessonPlanningMark (Junior) and lessonFacilitationMark (ECD)
        if (body.lessonPlanningMark !== undefined) {
          data.lessonPlanningMark = clamp(toInt(body.lessonPlanningMark), 15)
          data.lessonPlanningComment = body.lessonPlanningComment || data.lessonPlanningComment
        } else if (body.lessonFacilitationMark !== undefined) {
          data.lessonPlanningMark = clamp(toInt(body.lessonFacilitationMark), 15)
          data.lessonPlanningComment = body.lessonFacilitationComment || data.lessonPlanningComment
        }

        data.environmentMark = clamp(toInt(body.environmentMark), 10)
        data.environmentComment = body.environmentComment || data.environmentComment

        // Handle both documentsMark (Junior) and recordsMark (ECD)
        if (body.documentsMark !== undefined) {
          data.documentsMark = clamp(toInt(body.documentsMark), 15)
          data.documentsComment = body.documentsComment || data.documentsComment
        } else if (body.recordsMark !== undefined) {
          data.documentsMark = clamp(toInt(body.recordsMark), 15)
          data.documentsComment = body.recordsComment || data.documentsComment
        }

        data.personalDimensionsMark = clamp(toInt(body.deportmentMark), 5)
        data.personalDimensionsComment = body.deportmentComment || data.personalDimensionsComment

        data.communityMark = clamp(toInt(body.communityMark), 30)
        data.communityComment = body.communityComment || data.communityComment

        // Map remainingPillarsMark to conclusionMark since remainingPillarsMark doesn't exist in DB
        data.conclusionMark = clamp(toInt(body.remainingPillarsMark), 10)
        data.conclusionComment = body.remainingPillarsComment || data.conclusionComment

        // Ensure unused fields are zeroed to avoid double counting
        // Note: personalDimensionsMark is already set above from deportmentMark
        // Note: communityMark is already set above
      }
    } else if (body.formType === 'junior') {
      // Junior Level specific mapping
      data.preparationMark = clamp(toInt(body.preparationMark), 15)
      data.preparationComment = body.preparationComment || data.preparationComment
      data.lessonPlanningMark = clamp(toInt(body.lessonPlanningMark), 15)
      data.lessonPlanningComment = body.lessonPlanningComment || data.lessonPlanningComment
      data.personalDimensionsMark = clamp(toInt(body.deportmentMark), 5)
      data.personalDimensionsComment = body.deportmentComment || data.personalDimensionsComment
      data.documentsMark = clamp(toInt(body.documentsMark), 15)
      data.documentsComment = body.documentsComment || data.documentsComment
      data.environmentMark = clamp(toInt(body.environmentMark), 10)
      data.environmentComment = body.environmentComment || data.environmentComment
      data.communityMark = clamp(toInt(body.communityMark), 30)
      data.communityComment = body.communityComment || data.communityComment
      data.conclusionMark = clamp(toInt(body.remainingPillarsMark), 10)
      data.conclusionComment = body.remainingPillarsComment || data.conclusionComment
      
      // Zero out unused fields for Junior Level
      data.introductionMark = 0
      data.introductionComment = ''
      data.developmentMark = 0
      data.developmentComment = ''
    }

    console.log('Creating assessment with data:', data)
    const assessment = await prisma.assessment.create({ data, include: { student: true, supervisor: true } })

    console.log('Assessment created successfully:', assessment.id)
    return {
      message: 'Assessment created successfully',
      assessment
    }
  } catch (error) {
    console.error('Error creating assessment:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create assessment: ${error.message}`
    })
  } finally {
    await prisma.$disconnect()
  }
}) 